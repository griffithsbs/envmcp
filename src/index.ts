import fs from 'fs';
import path from 'path';
import os from 'os';
import { ChildProcess, spawn } from 'child_process';

const ENV_FILENAME = '.env.mcp';

function reportError(message: string, error?: unknown) {
  console.error(message);
  if (error) {
    console.error(error);
  }
}

/**
 * Finds the closest .env.mcp file by traversing up the directory tree
 * @param startDir The directory to start searching from
 * @returns The path to the found .env.mcp file or undefined if not found
 */
export function findEnvFilePath(startDir: string = process.cwd()): string | undefined {
  let currentDir = startDir;
  
  // Continue checking until we reach the root directory
  while (true) {
    const envFilePath = path.join(currentDir, ENV_FILENAME);
    
    try {
      if (fs.existsSync(envFilePath)) {
        return envFilePath;
      }
    } catch (err) {
      reportError(`Error checking file at ${envFilePath}:`, err);
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
  const homeEnvFile = path.join(homeDir, ENV_FILENAME);
  
  try {
    if (fs.existsSync(homeEnvFile)) {
      return homeEnvFile;
    }
  } catch (err) {
    reportError(`Error checking file at ${homeEnvFile}:`, err);
  }

  return undefined;
}

/**
 * Parses an environment file and returns its contents as key-value pairs
 * @param filePath Path to the environment file
 * @returns Object containing environment variables
 */
function parseEnvFile(filePath: string): Record<string, string> {
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
 * @param filePath Optional custom path to the env file
 * @returns True if environment variables were loaded, false otherwise
 */
export function loadEnvironmentVariablesFromFile(filePath?: string): boolean {
  const envPath = filePath || findEnvFilePath();
  
  if (!envPath) {
    console.error('No .env.mcp file found');
    return false;
  }
  
  try {
    const envVars = parseEnvFile(envPath);
    
    // Add variables to process.env
    Object.entries(envVars).forEach(([key, value]) => {
      process.env[key] = value;
    });
    
    return true;
  } catch (error) {
    reportError(`Error loading .env.mcp file:`, error);
    return false;
  }
}

/**
 * Executes a command with the given arguments
 * @param command The command to execute
 * @param args The arguments for the command
 * @returns The spawned ChildProcess
 */
export function executeCommand(command: string, args: string[] = []): ChildProcess {
  const childProcess = spawn(command, args, {
    stdio: 'inherit',
    shell: true,
    env: process.env
  });

  // Handle errors during spawn
  childProcess.on('error', (err) => {
    console.error(`Failed to start child process: ${err.message}`);
    process.exit(1);
  });
  
  // Handle process exit
  childProcess.on('close', (code: number, signal: string | null) => {
    if (signal) {
      console.warn(`Child process terminated by signal: ${signal}`);
      process.kill(process.pid, signal);
    } else {
      process.exit(code);
    }
  });

  return childProcess;
} 