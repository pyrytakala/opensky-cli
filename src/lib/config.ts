import { homedir } from "os";
import { join } from "path";

/** Application name (replaced during api2cli create) */
export const APP_NAME = "opensky";

/** CLI binary name (replaced during api2cli create) */
export const APP_CLI = "opensky-cli";

/** API base URL (replaced during api2cli create) */
export const BASE_URL = "https://opensky-network.org/api";

/** OAuth2 token endpoint */
export const TOKEN_URL = "https://auth.opensky-network.org/auth/realms/opensky-network/protocol/openid-connect/token";

/** Auth type: bearer | api-key | basic | custom | oauth2 */
export const AUTH_TYPE = "oauth2";

/** Auth header name (e.g. Authorization, X-Api-Key) */
export const AUTH_HEADER = "Authorization";

/** Path to the credentials file (clientId + clientSecret) */
export const CREDS_PATH = join(homedir(), ".config", "tokens", `${APP_NAME}-cli.json`);

/** Path to the cached access token */
export const TOKEN_PATH = join(homedir(), ".config", "tokens", `${APP_NAME}-cli-token.json`);

/** Global state for output flags (set by root command) */
export const globalFlags = {
  json: false,
  format: "text" as "text" | "json" | "csv" | "yaml",
  verbose: false,
  noColor: false,
  noHeader: false,
};
