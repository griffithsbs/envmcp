import fs from 'fs';
import path from 'path';
import os from 'os';

/**
 * Finds the closest .env.mcp file by traversing up the directory tree
 * @param startDir The directory to start searching from
 * @returns The path to the found .env.mcp file or undefined if not found
 */
export function findEnvFile(startDir: string = process.cwd()): string | undefined {
  let currentDir = startDir;
  
  // Continue checking until we reach the root directory
  while (true) {
    const envFilePath = path.join(currentDir, '.env.mcp');
    
    try {
      if (fs.existsSync(envFilePath)) {
        return envFilePath;
      }
    } catch (err) {
      console.error(`Error checking file at ${envFilePath}:`, err);
    }
    
    // Move up to the parent directory
    const parentDir = path.dirname(currentDir);
    
    // Stop if we've reached the root directory
    if (parentDir === currentDir) {
      break;
    }
    
    currentDir = parentDir;
  }

  // Special case: Check for ~/.env.mcp
  const homeDir = os.homedir();
  const homeEnvFile = path.join(homeDir, '.env.mcp');
  
  try {
    if (fs.existsSync(homeEnvFile)) {
      return homeEnvFile;
    }
  } catch (err) {
    console.error(`Error checking file at ${homeEnvFile}:`, err);
  }
  
  console.log('No .env.mcp file found in directory tree');
  return undefined;
}

/**
 * Parses an environment file and returns its contents as key-value pairs
 * @param filePath Path to the environment file
 * @returns Object containing environment variables
 */
export function parseEnvFile(filePath: string): Record<string, string> {
  const content = fs.readFileSync(filePath, 'utf8');
  const result: Record<string, string> = {};
  
  // Split by newlines and process each line
  const lines = content.split('\n');
  
  for (const line of lines) {
    // Skip empty lines and comments
    const trimmedLine = line.trim();
    if (!trimmedLine || trimmedLine.startsWith('#')) {
      continue;
    }
    
    // Parse key=value format
    const match = trimmedLine.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      let value = match[2].trim();
      
      // Remove surrounding quotes if present
      if ((value.startsWith('"') && value.endsWith('"')) || 
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.substring(1, value.length - 1);
      }
      
      result[key] = value;
    }
  }
  
  return result;
}

/**
 * Loads environment variables from a .env.mcp file
 * @param customPath Optional custom path to the env file
 * @returns True if environment variables were loaded, false otherwise
 */
export function loadEnvMcp(customPath?: string): boolean {
  const envPath = customPath || findEnvFile();
  
  if (!envPath) {
    console.error('No .env.mcp file found');
    return false;
  }
  
  try {
    console.log(`Loading environment variables from: ${envPath}`);
    const envVars = parseEnvFile(envPath);

    console.log(`Loaded variables: ${Object.keys(envVars).join(', ')}`);
    
    // Add variables to process.env
    Object.entries(envVars).forEach(([key, value]) => {
      process.env[key] = value;
    });
    
    return true;
  } catch (error) {
    console.error(`Error loading .env.mcp file: ${error}`);
    return false;
  }
}

/**
 * Executes a command with the given arguments
 * @param command The command to execute
 * @param args The arguments for the command
 */
export function executeCommand(command: string, args: string[] = []): void {
  const { spawn } = require('child_process');

  const childProcess = spawn(command, args, {
    stdio: 'inherit',
    shell: true,
    env: process.env
  });
  
  // Handle process exit
  childProcess.on('close', (code: number) => {
    process.exit(code);
  });
} 