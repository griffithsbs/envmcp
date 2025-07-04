#!/usr/bin/env node

import { spawn } from 'child_process';

function main() {
  let mcpipePath: string;
  
  try {
    mcpipePath = require.resolve('mcpipe/dist/cli.js');
  } catch (error) {
    console.error('Failed to locate mcpipe. Please ensure mcpipe is installed.');
    console.error('Try running: npm install mcpipe');
    process.exit(1);
  }
  
  const child = spawn('node', [mcpipePath, ...process.argv.slice(2)], {
    stdio: 'inherit',
    env: process.env
  });

  child.on('error', (err) => {
    console.error(`Failed to start mcpipe: ${err.message}`);
    process.exit(1);
  });

  child.on('close', (code, signal) => {
    if (signal) {
      process.kill(process.pid, signal);
    } else {
      process.exit(code ?? 1);
    }
  });
}

main();
