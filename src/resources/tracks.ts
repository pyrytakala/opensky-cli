import { Command } from "commander";
import { client } from "../lib/client.js";
import { output } from "../lib/output.js";
import { handleError } from "../lib/errors.js";

interface Waypoint {
  time: number;
  latitude: number | null;
  longitude: number | null;
  baro_altitude: number | null;
  true_track: number | null;
  on_ground: boolean;
}

const WAYPOINT_FIELDS = ["time", "latitude", "longitude", "baro_altitude", "true_track", "on_ground"];

function parseTrack(data: any): { icao24: string; callsign: string; startTime: number; endTime: number; waypoints: Waypoint[] } {
  const waypoints = (data?.path ?? []).map((p: any[]) => {
    const obj: Record<string, any> = {};
    WAYPOINT_FIELDS.forEach((f, i) => { obj[f] = p[i] ?? null; });
    return obj as Waypoint;
  });
  return {
    icao24: data?.icao24 ?? "",
    callsign: data?.callsign ?? "",
    startTime: data?.startTime ?? 0,
    endTime: data?.endTime ?? 0,
    waypoints,
  };
}

export const tracksResource = new Command("tracks")
  .description("Get aircraft flight tracks/trajectories");

tracksResource
  .command("get")
  .description("Get the trajectory for an aircraft")
  .requiredOption("--icao24 <addr>", "ICAO24 transponder address")
  .option("--time <unix>", "Unix timestamp within the flight window")
  .option("--fields <cols>", "Comma-separated columns for waypoints")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .addHelpText("after", `\nExamples:
  opensky-cli tracks get --icao24 abc9f3 --json
  opensky-cli tracks get --icao24 abc9f3 --time 1675000000 --json`)
  .action(async (opts: any) => {
    try {
      const params: Record<string, string> = { icao24: opts.icao24 };
      if (opts.time) params.time = opts.time;

      const raw = await client.get("/tracks", params);
      const track = parseTrack(raw);
      const fields = opts.fields?.split(",");
      output(track, { json: opts.json, format: opts.format, fields });
    } catch (err) {
      handleError(err, opts.json);
    }
  });
