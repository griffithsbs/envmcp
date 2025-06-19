#!/usr/bin/env node

import { loadEnvironmentVariablesFromFile, executeCommand } from './index';

function printUsage() {
  console.error('Usage: envmcp [--env-file <path>] <command> [args...]');
  console.error('\nOptions:');
  console.error('  -e, --env-file <path>     Specify a custom path to the environment file');
  console.error('\nArguments:');
  console.error('  <command>                 The command to execute');
  console.error('  [args...]                 Arguments for the command');
  console.error('\nNote: All options must precede the command.');
}

function main() {
  const argv = process.argv.slice(2);
  let customEnvFilePath: string | undefined = undefined;
  let commandIndex = 0;
  let error = false;

  // Check for and parse any arguments provided to envmcp itself
  while (commandIndex < argv.length) {
    const arg = argv[commandIndex];
    if (arg === '--env-file' || arg === '-e') {
      if (customEnvFilePath !== undefined) {
        console.error('Error: --env-file option specified more than once.');
        error = true;
        break;
      }
      if (commandIndex + 1 >= argv.length || argv[commandIndex + 1].startsWith('-')) {
        console.error(`Error: ${arg} option requires a path.`);
        error = true;
        break;
      }
      customEnvFilePath = argv[commandIndex + 1];
      commandIndex += 2;
    } else {
      // First non-option argument marks the start of the command
      break;
    }
  }

  const commandArgs = argv.slice(commandIndex);

  if (error || commandArgs.length === 0) {
    if (!error) {
      console.error('Error: Command is required');
    }
    printUsage();
    process.exit(1);
  }

  const command = commandArgs[0];
  const actualArgsForCommand = commandArgs.slice(1);

  // Load environment variables from .env.mcp file
  if (!loadEnvironmentVariablesFromFile(customEnvFilePath)) {
    process.exit(1);
  }

  // Execute the command with args
  executeCommand(command, actualArgsForCommand);
}

main(); 