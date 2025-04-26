import { execFile } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';

describe('envmcp CLI', () => {
  const defaultEnvFile = path.join(process.cwd(), '.env.mcp');
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'envmcp-test-'));
  const customEnvFile = path.join(tempDir, 'custom.env.mcp');

  beforeAll(() => {
    fs.writeFileSync(defaultEnvFile, 'TEST_VAR=default_value\n');
    fs.writeFileSync(customEnvFile, 'TEST_VAR=custom_value\n');
  });

  afterAll(() => {
    fs.unlinkSync(defaultEnvFile);
    // Clean up temp directory
    fs.rmSync(tempDir, { recursive: true, force: true });
  });
  
  it('should use custom env file when --env-file is specified', (done) => {
    const args = [
      path.join(process.cwd(), 'dist/cli.js'),
      '--env-file',
      customEnvFile,
      'node',
      '-p',
      'process.env.TEST_VAR'
    ];

    execFile(process.execPath, args, (error, stdout, stderr) => {
      if (error) {
        console.error('Test error:', error);
        console.error('stderr:', stderr);
        done.fail(error);
        return;
      }
      expect(stdout.trim()).toBe('custom_value');
      done();
    });
  }, 10000);
  
  it('should use custom env file when -e is specified', (done) => {
    const args = [
      path.join(process.cwd(), 'dist/cli.js'),
      '-e',
      customEnvFile,
      'node',
      '-p',
      'process.env.TEST_VAR'
    ];

    execFile(process.execPath, args, (error, stdout, stderr) => {
      if (error) {
        console.error('Test error:', error);
        console.error('stderr:', stderr);
        done.fail(error);
        return;
      }
      expect(stdout.trim()).toBe('custom_value');
      done();
    });
  }, 10000);
  
  it('should error when --env-file is specified without a path', (done) => {
    const args = [
      path.join(process.cwd(), 'dist/cli.js'),
      '--env-file'
    ];

    execFile(process.execPath, args, (error, stdout, stderr) => {
      expect(error).not.toBeNull();
      // Normalize path separators in error message for cross-platform testing
      const normalizedError = stderr.replace(/\\/g, '/');
      expect(normalizedError).toContain('--env-file option requires a path');
      done();
    });
  }, 10000);

  it('should use default env file location when no file specified in arguments', (done) => {
    execFile(process.execPath, [
      path.join(process.cwd(), 'dist/cli.js'),
      'node',
      '-p',
      'process.env.TEST_VAR'
    ], (error, stdout, stderr) => {
      if (error) {
        console.error('Test error:', error);
        console.error('stderr:', stderr);
      }
      expect(error).toBeNull();
      expect(stdout.trim()).toBe('default_value');
      done();
    });
  }, 10000);
});
