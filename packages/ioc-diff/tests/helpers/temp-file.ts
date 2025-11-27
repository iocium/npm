import fs from 'fs';
import path from 'path';

const tempFiles: string[] = [];

/**
 * Write a temporary file and track it for later cleanup.
 */
export function writeTempFile(name: string, contents: string): string {
  const filePath = path.join(__dirname, '..', name);
  fs.writeFileSync(filePath, contents);
  tempFiles.push(filePath);
  return filePath;
}

/**
 * Delete all temporary files created during the test.
 */
export function cleanupTempFiles(): void {
  for (const file of tempFiles) {
    try {
      fs.unlinkSync(file);
    } catch {
      // Ignore errors
    }
  }
}