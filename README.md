# envmcp
[![npm version](https://img.shields.io/npm/v/envmcp.svg)](https://www.npmjs.com/package/envmcp)
[![total downloads](https://img.shields.io/npm/dt/envmcp.svg)](https://www.npmjs.com/package/envmcp)

Use environment variables in your Cursor MCP server definitions.

> **💡 Looking for more features?** The latest version of envmcp delegates its implementation to my other project, [mcpipe](https://github.com/griffithsbs/mcpipe) ([npm](https://www.npmjs.com/package/mcpipe)) which includes envmcp's functionality as well as debugging and tool-namespacing capabilities for stdio MCP servers. If you would find these other features useful, consider using [mcpipe](https://github.com/griffithsbs/mcpipe) directly instead!

## Quick Start

```bash
# Use default ~/.env.mcp file
npx envmcp your-mcp-server $DATABASE_URL

# Specify custom env file
npx envmcp --env-file .env your-mcp-server $API_KEY $DATABASE_URL

# Short flag version
npx envmcp -e /path/to/secrets.env your-mcp-server $MY_SECRET
```

## Usage in MCP Clients

Prefix your server command with envmcp.

_Before (secrets exposed in config)_: 
```json
{
  "my_database": {
    "command": "my-mcp-server",
    "args": ["postgresql://user:password@hostname/db"]
  }
}
```
_After (secrets in ~/.env.mcp)_:
```json
{
  "my_database": {
    "command": "npx",
    "args": ["envmcp", "my-mcp-server", "$DATABASE_URL"]
  }
}
```

## How It Works

1. Looks for `.env.mcp` in current directory, then parent directories, finally `~/.env.mcp`
2. If `--env-file` is specified, uses that file instead
3. Loads environment variables from the file
4. Replaces `$VARIABLE_NAME` references in your command arguments
5. Executes the command with substituted values

## Installation

```bash
npm install -g envmcp
```

## Options

- `--env-file <path>`, `-e <path>`: Specify custom environment file path

## Environment File Format

```
DATABASE_URL=postgresql://user:password@localhost/db
API_KEY=your-secret-api-key
# This is a comment
QUOTED_VALUE="value with spaces"
```

See `sample.env.mcp` for more examples.

## License

MIT 
