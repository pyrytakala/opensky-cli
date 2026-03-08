---
name: opensky
description: "Manage opensky via CLI - states, flights, tracks. Use when user mentions 'opensky' or wants to interact with the opensky API."
category: aviation
---

# opensky-cli

## Setup

If `opensky-cli` is not found, install and build it:
```bash
bun --version || curl -fsSL https://bun.sh/install | bash
npx api2cli bundle opensky
npx api2cli link opensky
```

`api2cli link` adds `~/.local/bin` to PATH automatically. The CLI is available in the next command.

Always use `--json` flag when calling commands programmatically.

## Authentication

Authentication is optional. Anonymous access works with rate limits. For higher limits, set credentials (username:password):

```bash
opensky-cli auth set "username:password"
opensky-cli auth test
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
