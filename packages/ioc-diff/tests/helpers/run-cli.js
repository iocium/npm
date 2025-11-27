const { execSync } = require('node:child_process');
const path = require('node:path');

/**
 * Run the compiled CLI from dist/bin/ioc-diff.js
 */
function runCli(args = '') {
  const cliPath = path.resolve(__dirname, '../../dist/bin/ioc-diff.js');
  return execSync(`node ${cliPath} ${args}`, { encoding: 'utf8' });
}

module.exports = { runCli };