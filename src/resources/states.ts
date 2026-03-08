import { Command } from "commander";
import { client } from "../lib/client.js";
import { output } from "../lib/output.js";
import { handleError } from "../lib/errors.js";

interface StateVector {
  icao24: string;
  callsign: string;
  origin_country: string;
  time_position: number | null;
  last_contact: number;
  longitude: number | null;
  latitude: number | null;
  baro_altitude: number | null;
  on_ground: boolean;
  velocity: number | null;
  true_track: number | null;
  vertical_rate: number | null;
  sensors: number[] | null;
  geo_altitude: number | null;
  squawk: string | null;
  spi: boolean;
  position_source: number;
  category?: number;
}

const STATE_FIELDS = [
  "icao24", "callsign", "origin_country", "time_position", "last_contact",
  "longitude", "latitude", "baro_altitude", "on_ground", "velocity",
  "true_track", "vertical_rate", "sensors", "geo_altitude", "squawk",
  "spi", "position_source", "category",
];

function parseStates(data: any): StateVector[] {
  if (!data?.states) return [];
  return data.states.map((s: any[]) => {
    const obj: Record<string, any> = {};
    STATE_FIELDS.forEach((f, i) => { obj[f] = s[i] ?? null; });
    return obj as StateVector;
  });
}

export const statesResource = new Command("states")
  .description("Get live aircraft state vectors");

// ── ALL ──────────────────────────────────────────────
statesResource
  .command("all")
  .description("Get all current state vectors (optionally filtered)")
  .option("--time <unix>", "Unix timestamp (default: now)")
  .option("--icao24 <addr...>", "ICAO24 address(es) to filter by")
  .option("--lamin <lat>", "Lower latitude bound for bounding box")
  .option("--lomin <lon>", "Lower longitude bound for bounding box")
  .option("--lamax <lat>", "Upper latitude bound for bounding box")
  .option("--lomax <lon>", "Upper longitude bound for bounding box")
  .option("--extended", "Include aircraft category info")
  .option("--fields <cols>", "Comma-separated columns to display")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .addHelpText("after", `\nExamples:
  opensky-cli states all
  opensky-cli states all --icao24 abc9f3
  opensky-cli states all --lamin 45.8 --lomin 5.9 --lamax 47.8 --lomax 10.5 --json
  opensky-cli states all --extended --json`)
  .action(async (opts: any) => {
    try {
      const params: Record<string, string> = {};
      if (opts.time) params.time = opts.time;
      if (opts.icao24) params.icao24 = Array.isArray(opts.icao24) ? opts.icao24.join(",") : opts.icao24;
      if (opts.lamin) params.lamin = opts.lamin;
      if (opts.lomin) params.lomin = opts.lomin;
      if (opts.lamax) params.lamax = opts.lamax;
      if (opts.lomax) params.lomax = opts.lomax;
      if (opts.extended) params.extended = "1";

      const raw = await client.get("/states/all", params);
      const states = parseStates(raw);
      const fields = opts.fields?.split(",");
      output(states, { json: opts.json, format: opts.format, fields });
    } catch (err) {
      handleError(err, opts.json);
    }
  });

// ── OWN ──────────────────────────────────────────────
statesResource
  .command("own")
  .description("Get state vectors for your own sensors (requires auth)")
  .option("--time <unix>", "Unix timestamp (default: now)")
  .option("--icao24 <addr...>", "ICAO24 address(es) to filter by")
  .option("--serials <serial...>", "Receiver serial number(s)")
  .option("--fields <cols>", "Comma-separated columns to display")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .addHelpText("after", `\nExamples:
  opensky-cli states own --json
  opensky-cli states own --icao24 abc9f3 --json`)
  .action(async (opts: any) => {
    try {
      const params: Record<string, string> = {};
      if (opts.time) params.time = opts.time;
      if (opts.icao24) params.icao24 = Array.isArray(opts.icao24) ? opts.icao24.join(",") : opts.icao24;
      if (opts.serials) params.serials = Array.isArray(opts.serials) ? opts.serials.join(",") : opts.serials;

      const raw = await client.get("/states/own", params);
      const states = parseStates(raw);
      const fields = opts.fields?.split(",");
      output(states, { json: opts.json, format: opts.format, fields });
    } catch (err) {
      handleError(err, opts.json);
    }
  });
