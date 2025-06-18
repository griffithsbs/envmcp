# Contributing to envmcp

Contributions are welcome: please feel free to open issues or PRs!

## Development Setup

**Prerequisites:**
- Node.js 14 or later
- npm

**Setup:**
```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test
```

## Testing Your Changes

You can end-to-end test your local build by linking it:

```bash
npm run build
npm link

# Create a test env file
echo "TEST_VAR=hello world" > test.env

# Test with environment variable substitution
envmcp --env-file test.env echo '$TEST_VAR'

# Unlink when done
npm unlink -g envmcp
```

## Questions?

Feel free to open an issue if you have questions about contributing.
