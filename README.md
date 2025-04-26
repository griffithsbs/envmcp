# envmcp
[![npm version](https://img.shields.io/npm/v/envmcp.svg)](https://www.npmjs.com/package/envmcp)
[![total downloads](https://img.shields.io/npm/dt/envmcp.svg)](https://www.npmjs.com/package/envmcp)

Use environment variables in your Cursor MCP server definitions.

## Recommended usage
Prefix your stdio command with `npx envmcp` and reference env vars by name in your cursor MCP config.

You can either pass the filepath of your env file as an argument...
```json
{
  "my_mcp_server": {
    "command": "npx",
    "args": [
      "envmcp",
      "--env-file",
      "/path/to/my.env.file",
      "start-my-mcp-server",
      "$MY_NAMED_ENVIRONMENT_VARIABLE",
    ]
  },
  "example_with_shorthand_flag_name": {
    "command": "npx",
    "args": [
      "envmcp",
      "-e",
      "/path/to/my.env.file",
      "npx", "pull-something-else-with-npx", "$MY_DATABASE_CONNECTION_STRING",
    ]
  }
}
```
... or put your secrets into a file called `.env.mcp` in your user's home directory, which will be looked up by default:
```json
{
  "my_mcp_server": {
    "command": "npx",
    "args": [
      "envmcp",
      "start-my-mcp-server",
      "$MY_NAMED_ENVIRONMENT_VARIABLE",
    ]
  }
}
```

## What does it do?
Receives a shell command as input, loads environment variables from an env file, and then executes the command

## What's the point?
Store the secrets needed by your MCP server config in a file called .env.mcp in your home directory, and then replace this...

```json
{
  "my_database": {
    "command": "start-my-mcp-server",
    "args": [
      "my secret connection string",
    ]
  },
  "my_other_mcp_server": {
    "command": "start-my-other-mcp-server",
    "env": {
      "MY_API_KEY": "my api key"
    }
  }
}
```

... with this:
```json
{
  "my_database": {
    "command": "npx",
    "args": [
      "envmcp",
      "start-my-mcp-server",
      "$MY_DATABASE_CONNECTION_STRING",
    ]
  },
  "my_other_mcp_server": {
    "command": "npx",
    "args": [
      "envmcp",
      "start-my-other-mcp-server",
    ]
  }
}
```

## Installation

```bash
npm install -g envmcp
```

## Usage

```bash
envmcp [--env-file <path>] <command> [args...]
```

The tool will:
1. Look for a `.env.mcp` file in the current directory
2. If not found, it will search up the directory tree for a `.env.mcp` file
3. As a last resort, it will check for `~/.env.mcp`
4. If `--env-file` or `-e` is specified, it will use that file instead of searching
5. Load the environment variables from the found `.env.mcp` file
6. Execute the specified command with any provided arguments

### Options

- `--env-file <path>` or `-e <path>`: Specify a custom path to the environment file

## Environment File Format

The `.env.mcp` file follows the standard environment file format:

```
KEY=value
ANOTHER_KEY=another value
# This is a comment
QUOTED_VALUE="value with spaces"
```

See the `sample.env.mcp` file for a more detailed example.

## Contributing

Contributions are welcome: please feel free to open issues or PRs!

## Development

### Prerequisites

- Node.js 14 or later
- npm

### Setup

```bash
# Install dependencies
npm install

# Build the package
npm run build
```

### Publishing

```bash
# Log in to npm
npm login

# Publish the package
npm publish
```

## License

MIT 
