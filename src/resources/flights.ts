import { Command } from "commander";
import { client } from "../lib/client.js";
import { output } from "../lib/output.js";
import { handleError } from "../lib/errors.js";

export const flightsResource = new Command("flights")
  .description("Query flight data by time, aircraft, or airport");

// ── ALL ──────────────────────────────────────────────
flightsResource
  .command("all")
  .description("Get all flights in a time interval")
  .requiredOption("--begin <unix>", "Start time (Unix seconds)")
  .requiredOption("--end <unix>", "End time (Unix seconds)")
  .option("--fields <cols>", "Comma-separated columns to display")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .addHelpText("after", `\nExamples:
  opensky-cli flights all --begin 1675000000 --end 1675003600 --json`)
  .action(async (opts: any) => {
    try {
      const data = await client.get("/flights/all", {
        begin: opts.begin,
        end: opts.end,
      });
      const fields = opts.fields?.split(",");
      output(data, { json: opts.json, format: opts.format, fields });
    } catch (err) {
      handleError(err, opts.json);
    }
  });

// ── BY AIRCRAFT ──────────────────────────────────────
flightsResource
  .command("aircraft")
  .description("Get flights for a specific aircraft")
  .requiredOption("--icao24 <addr>", "ICAO24 transponder address")
  .requiredOption("--begin <unix>", "Start time (Unix seconds)")
  .requiredOption("--end <unix>", "End time (Unix seconds)")
  .option("--fields <cols>", "Comma-separated columns to display")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .addHelpText("after", `\nExamples:
  opensky-cli flights aircraft --icao24 abc9f3 --begin 1675000000 --end 1675086400 --json`)
  .action(async (opts: any) => {
    try {
      const data = await client.get("/flights/aircraft", {
        icao24: opts.icao24,
        begin: opts.begin,
        end: opts.end,
      });
      const fields = opts.fields?.split(",");
      output(data, { json: opts.json, format: opts.format, fields });
    } catch (err) {
      handleError(err, opts.json);
    }
  });

// ── ARRIVALS ─────────────────────────────────────────
flightsResource
  .command("arrivals")
  .description("Get arrivals at an airport")
  .requiredOption("--airport <icao>", "ICAO airport code (e.g. EDDF)")
  .requiredOption("--begin <unix>", "Start time (Unix seconds)")
  .requiredOption("--end <unix>", "End time (Unix seconds)")
  .option("--fields <cols>", "Comma-separated columns to display")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .addHelpText("after", `\nExamples:
  opensky-cli flights arrivals --airport EDDF --begin 1675000000 --end 1675086400 --json`)
  .action(async (opts: any) => {
    try {
      const data = await client.get("/flights/arrival", {
        airport: opts.airport,
        begin: opts.begin,
        end: opts.end,
      });
      const fields = opts.fields?.split(",");
      output(data, { json: opts.json, format: opts.format, fields });
    } catch (err) {
      handleError(err, opts.json);
    }
  });

// ── DEPARTURES ───────────────────────────────────────
flightsResource
  .command("departures")
  .description("Get departures from an airport")
  .requiredOption("--airport <icao>", "ICAO airport code (e.g. EDDF)")
  .requiredOption("--begin <unix>", "Start time (Unix seconds)")
  .requiredOption("--end <unix>", "End time (Unix seconds)")
  .option("--fields <cols>", "Comma-separated columns to display")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .addHelpText("after", `\nExamples:
  opensky-cli flights departures --airport EDDF --begin 1675000000 --end 1675086400 --json`)
  .action(async (opts: any) => {
    try {
      const data = await client.get("/flights/departure", {
        airport: opts.airport,
        begin: opts.begin,
        end: opts.end,
      });
      const fields = opts.fields?.split(",");
      output(data, { json: opts.json, format: opts.format, fields });
    } catch (err) {
      handleError(err, opts.json);
    }
  });
