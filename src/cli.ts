#!/usr/bin/env node

import { loadEnvMcp, executeCommand } from './index';

function main() {
  // Parse command line arguments
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.error('Error: Command is required');
    console.error('Usage: envmcp [--env-file <path>] <command> [args...]');
    process.exit(1);
  }

  let envFilePath: string | undefined;
  let command: string;
  let commandArgs: string[];

  // Check for --env-file option
  const envFileIndex = args.findIndex((arg: string) => arg === '--env-file' || arg === '-e');
  if (envFileIndex !== -1) {
    if (envFileIndex + 1 >= args.length) {
      console.error('Error: --env-file option requires a path');
      process.exit(1);
    }
    envFilePath = args[envFileIndex + 1];
    // Remove the --env-file option and its value from args
    args.splice(envFileIndex, 2);
  }

  if (args.length === 0) {
    console.error('Error: Command is required');
    console.error('Usage: envmcp [--env-file <path>] <command> [args...]');
    process.exit(1);
  }
  
  // The first argument is the command to execute
  command = args[0];
  // The rest are arguments to pass to the command
  commandArgs = args.slice(1);
  
  // Load environment variables from .env.mcp file
  if (!loadEnvMcp(envFilePath)) {
    process.exit(1);
  }
  
  // Execute the command with args
  executeCommand(command, commandArgs);
}

main(); 