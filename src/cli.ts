#!/usr/bin/env node

import { loadEnvMcp, executeCommand } from './index';

function main() {
  // Parse command line arguments
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.error('Error: Command is required');
    console.error('Usage: envmcp <command> [args...]');
    process.exit(1);
  }
  
  // The first argument is the command to execute
  const command = args[0];
  // The rest are arguments to pass to the command
  const commandArgs = args.slice(1);
  
  // Load environment variables from .env.mcp file
  loadEnvMcp();
  
  // Execute the command with args
  executeCommand(command, commandArgs);
}

main(); 