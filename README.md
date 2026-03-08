# opensky-cli

Unofficial CLI for the OpenSky Network API - live aircraft tracking data. Made with [api2cli.dev](https://api2cli.dev).

> **Note:** This is a community-maintained project and is not officially affiliated with or endorsed by OpenSky Network.

## Install

```bash
npx api2cli install pyry/opensky-cli
```

This clones the repo, builds the CLI, links it to your PATH, and installs the AgentSkill to your coding agents.

## Install AgentSkill only

```bash
npx skills add pyry/opensky-cli
```

## Usage

Authentication is optional. Anonymous access works with rate limits.

```bash
# Optional: set credentials for higher rate limits
opensky-cli auth set "username:password"

opensky-cli --help
```

## Resources

### states

| Command | Description |
|---------|-------------|
| `opensky-cli states all --json` | Get all current aircraft state vectors |
| `opensky-cli states all --lamin 45.8 --lomin 5.9 --lamax 47.8 --lomax 10.5 --json` | Get states in bounding box |
| `opensky-cli states all --icao24 abc9f3 --json` | Get state for specific aircraft |
| `opensky-cli states all --extended --json` | Get states with aircraft category |
| `opensky-cli states own --json` | Get states for your own sensors (requires auth) |

### flights

| Command | Description |
|---------|-------------|
| `opensky-cli flights all --begin <unix> --end <unix> --json` | Get all flights in time interval |
| `opensky-cli flights aircraft --icao24 abc9f3 --begin <unix> --end <unix> --json` | Get flights for specific aircraft |
| `opensky-cli flights arrivals --airport EDDF --begin <unix> --end <unix> --json` | Get arrivals at airport |
| `opensky-cli flights departures --airport EDDF --begin <unix> --end <unix> --json` | Get departures from airport |

### tracks

| Command | Description |
|---------|-------------|
| `opensky-cli tracks get --icao24 abc9f3 --json` | Get trajectory for an aircraft |
| `opensky-cli tracks get --icao24 abc9f3 --time <unix> --json` | Get trajectory at specific time |

## Global Flags

All commands support: `--json`, `--format <text|json|csv|yaml>`, `--verbose`, `--no-color`, `--no-header`
