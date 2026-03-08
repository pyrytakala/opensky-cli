import { Command } from "commander";
import { getCredentials, setCredentials, removeToken, hasToken, maskToken, getAccessToken } from "../lib/auth.js";
import { log } from "../lib/logger.js";
import { handleError } from "../lib/errors.js";

export const authCommand = new Command("auth").description("Manage API authentication (OAuth2 client credentials)");

authCommand
  .command("set")
  .description("Save your OAuth2 client credentials")
  .requiredOption("--client-id <id>", "OAuth2 client ID")
  .requiredOption("--client-secret <secret>", "OAuth2 client secret")
  .addHelpText("after", '\nExample:\n  opensky-cli auth set --client-id "user@example.com-api-client" --client-secret "abc123"')
  .action((opts: { clientId: string; clientSecret: string }) => {
    setCredentials(opts.clientId, opts.clientSecret);
    log.success("Credentials saved securely");
  });

authCommand
  .command("show")
  .description("Display current credentials (masked by default)")
  .option("--raw", "Show unmasked values")
  .addHelpText("after", "\nExample:\n  opensky-cli auth show\n  opensky-cli auth show --raw")
  .action((opts: { raw?: boolean }) => {
    if (!hasToken()) {
      log.warn("No credentials configured. Run: opensky-cli auth set --client-id <id> --client-secret <secret>");
      return;
    }
    const creds = getCredentials();
    if (opts.raw) {
      console.log(`Client ID:     ${creds.clientId}`);
      console.log(`Client Secret: ${creds.clientSecret}`);
    } else {
      console.log(`Client ID:     ${maskToken(creds.clientId)}`);
      console.log(`Client Secret: ${maskToken(creds.clientSecret)}`);
    }
  });

authCommand
  .command("remove")
  .description("Delete saved credentials and cached tokens")
  .addHelpText("after", "\nExample:\n  opensky-cli auth remove")
  .action(() => {
    removeToken();
    log.success("Credentials and tokens removed");
  });

authCommand
  .command("test")
  .description("Verify credentials by acquiring an access token")
  .addHelpText("after", "\nExample:\n  opensky-cli auth test")
  .action(async () => {
    try {
      const token = await getAccessToken();
      if (token) {
        log.success(`Authentication successful (token: ${maskToken(token)})`);
      } else {
        log.warn("No credentials configured");
      }
    } catch (err) {
      handleError(err);
    }
  });
