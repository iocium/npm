const { runCli } = require('./helpers/run-cli.js');
import { writeTempFile, cleanupTempFiles } from './helpers/temp-file';

describe('CLI basic usage', () => {
  it('compares two plaintext IOC files and detects additions', () => {
    const oldPath = writeTempFile('old-plain.txt', `
      1.2.3.4
      test.com
    `);
    const newPath = writeTempFile('new-plain.txt', `
      1.2.3.4
      test.com
      9.9.9.9
    `);

    const output = runCli(`--old ${oldPath} --new ${newPath}`);
    const json = JSON.parse(output);
    expect(json.added).toHaveLength(1);
    expect(json.added[0].value).toBe('9.9.9.9');
    expect(json.removed).toHaveLength(0);
  });

  it('handles CSV input and detects removed IOCs', () => {
    const csvOld = `value,type,severity
1.2.3.4,ip,low
5.5.5.5,ip,medium
`;
    const csvNew = `value,type,severity
5.5.5.5,ip,medium
`;

    const oldPath = writeTempFile('old.csv', csvOld);
    const newPath = writeTempFile('new.csv', csvNew);

    const output = runCli(`--old ${oldPath} --new ${newPath}`);
    const json = JSON.parse(output);
    expect(json.removed).toHaveLength(1);
    expect(json.removed[0].value).toBe('1.2.3.4');
    expect(json.added).toHaveLength(0);
  });
});

afterAll(() => {
  cleanupTempFiles();
});