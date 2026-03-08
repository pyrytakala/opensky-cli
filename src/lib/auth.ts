import { existsSync, readFileSync, writeFileSync, unlinkSync, mkdirSync, chmodSync } from "fs";
import { dirname } from "path";
import { CREDS_PATH, TOKEN_PATH, TOKEN_URL, APP_CLI } from "./config.js";
import { CliError } from "./errors.js";
import { log } from "./logger.js";

interface ClientCredentials {
  clientId: string;
  clientSecret: string;
}

interface CachedToken {
  access_token: string;
  expires_at: number; // unix ms
}

/** Check if client credentials are configured */
export function hasToken(): boolean {
  return existsSync(CREDS_PATH);
}

/** Read stored client credentials. Throws if not configured. */
export function getCredentials(): ClientCredentials {
  if (!hasToken()) {
    throw new CliError(2, "No credentials configured.", `Run: ${APP_CLI} auth set --client-id <id> --client-secret <secret>`);
  }
  return JSON.parse(readFileSync(CREDS_PATH, "utf-8"));
}

/** Save client credentials to disk with restricted permissions (chmod 600). */
export function setCredentials(clientId: string, clientSecret: string): void {
  mkdirSync(dirname(CREDS_PATH), { recursive: true });
  writeFileSync(CREDS_PATH, JSON.stringify({ clientId, clientSecret }, null, 2), { mode: 0o600 });
  chmodSync(CREDS_PATH, 0o600);
  // Clear any cached token when creds change
  if (existsSync(TOKEN_PATH)) unlinkSync(TOKEN_PATH);
}

/** Delete stored credentials and cached token. */
export function removeToken(): void {
  if (existsSync(CREDS_PATH)) unlinkSync(CREDS_PATH);
  if (existsSync(TOKEN_PATH)) unlinkSync(TOKEN_PATH);
}

/** Mask a string for display */
export function maskToken(s: string): string {
  if (s.length <= 8) return "****";
  return `${s.slice(0, 4)}...${s.slice(-4)}`;
}

/** Read cached access token if still valid (with 60s buffer). */
function getCachedToken(): string | null {
  if (!existsSync(TOKEN_PATH)) return null;
  try {
    const cached: CachedToken = JSON.parse(readFileSync(TOKEN_PATH, "utf-8"));
    if (Date.now() < cached.expires_at - 60_000) {
      return cached.access_token;
    }
  } catch {}
  return null;
}

/** Cache an access token with its expiry. */
function cacheToken(accessToken: string, expiresIn: number): void {
  mkdirSync(dirname(TOKEN_PATH), { recursive: true });
  const cached: CachedToken = {
    access_token: accessToken,
    expires_at: Date.now() + expiresIn * 1000,
  };
  writeFileSync(TOKEN_PATH, JSON.stringify(cached), { mode: 0o600 });
  chmodSync(TOKEN_PATH, 0o600);
}

/** Exchange client credentials for an access token via OAuth2. */
async function fetchAccessToken(): Promise<string> {
  const creds = getCredentials();

  const body = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: creds.clientId,
    client_secret: creds.clientSecret,
  });

  log.debug(`POST ${TOKEN_URL}`);
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
    signal: AbortSignal.timeout(15_000),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new CliError(res.status, `OAuth2 token request failed: ${res.status} ${text}`);
  }

  const data = await res.json() as { access_token: string; expires_in: number };
  cacheToken(data.access_token, data.expires_in);
  log.debug(`Token acquired, expires in ${data.expires_in}s`);
  return data.access_token;
}

/** Get a valid access token (from cache or fresh). Returns empty headers if no creds. */
export async function getAccessToken(): Promise<string | null> {
  if (!hasToken()) return null;

  const cached = getCachedToken();
  if (cached) return cached;

  return fetchAccessToken();
}

/** Build auth headers. Must be called with await. Returns empty if no creds configured. */
export async function buildAuthHeadersAsync(): Promise<Record<string, string>> {
  const token = await getAccessToken();
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

// Keep sync version for backward compat but it only works with cached tokens
export function buildAuthHeaders(): Record<string, string> {
  if (!hasToken()) return {};
  const cached = getCachedToken();
  if (!cached) return {};
  return { Authorization: `Bearer ${cached}` };
}
