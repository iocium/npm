#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { hideBin } from 'yargs/helpers';
import yargs from 'yargs/yargs';
import yaml from 'js-yaml';
import { parse as parseCSV } from 'csv-parse/sync';
import { diffIOCs } from '../index';
import { parsePlainIOCs } from '../src/utils';
import type { IOC } from '../src/types';

type Format = 'plaintext' | 'json' | 'misp' | 'csv' | 'yara' | 'sigma';

const argv = yargs(hideBin(process.argv))
  .option('old', {
    type: 'string',
    describe: 'Path to old IOC file',
    demandOption: true
  })
  .option('new', {
    type: 'string',
    describe: 'Path to new IOC file',
    demandOption: true
  })
  .option('old-format', {
    type: 'string',
    describe: 'Format of old IOC file',
    choices: ['plaintext', 'json', 'misp', 'csv', 'yara', 'sigma'] as const
  })
  .option('new-format', {
    type: 'string',
    describe: 'Format of new IOC file',
    choices: ['plaintext', 'json', 'misp', 'csv', 'yara', 'sigma'] as const
  })
  .option('fuzzy', {
    type: 'boolean',
    describe: 'Enable fuzzy matching',
    default: false
  })
  .option('threshold', {
    type: 'number',
    describe: 'Fuzzy match similarity threshold (0–1)',
    default: 0.85
  })
  .help()
  .alias('h', 'help')
  .parseSync();

function detectFormat(filename: string): Format {
  const ext = path.extname(filename).toLowerCase();
  if (ext === '.json') return filename.endsWith('.misp.json') ? 'misp' : 'json';
  if (ext === '.csv') return 'csv';
  if (ext === '.yara') return 'yara';
  if (ext === '.yml' || ext === '.yaml') return 'sigma';
  return 'plaintext';
}

function parseIOCFile(file: string, overrideFormat?: string): IOC[] {
  const format = overrideFormat as Format || detectFormat(file);
  const raw = fs.readFileSync(file, 'utf8');

  switch (format) {
    case 'json': {
      const json = JSON.parse(raw);
      return Array.isArray(json) ? json : json.iocs || [];
    }
    case 'misp': {
      const json = JSON.parse(raw);
      const attributes = json?.Event?.Attribute ?? [];
      return attributes.map((attr: any) => ({
        value: attr.value,
        type: attr.type,
        tags: attr.tags?.map((t: any) => t.name),
        source: 'misp'
      }));
    }
    case 'csv': {
      const records = parseCSV(raw, { columns: true });
      return records.map((row: any) => ({
        value: row.value || row.indicator || row.indicator_value,
        type: row.type || row.indicator_type,
        tags: row.tags?.split(',').map((t: string) => t.trim()),
        severity: row.severity,
        source: row.source
      })).filter((ioc: IOC) => !!ioc.value);
    }
    case 'yara': {
      const iocs: IOC[] = [];
      const lines = raw.split(/\r?\n/);
      for (const line of lines) {
        const match = line.match(/\$[\w_]+\s*=\s*"([^"]+)"/);
        if (match) {
          iocs.push({ value: match[1], type: 'string', source: 'yara' });
        }
      }
      return iocs;
    }
    case 'sigma': {
      const doc = yaml.load(raw);
      const detection = (doc as any)?.detection ?? {};
      const iocs: IOC[] = [];
      for (const val of Object.values(detection)) {
        if (typeof val === 'object' && !Array.isArray(val)) {
          for (const sub of Object.values(val)) {
            if (typeof sub === 'string') {
              iocs.push({ value: sub, type: 'string', source: 'sigma' });
            }
          }
        }
      }
      return iocs;
    }
    case 'plaintext':
    default:
      return parsePlainIOCs(raw.split(/\r?\n/));
  }
}

const oldIOCs = parseIOCFile(argv.old, argv.oldFormat);
const newIOCs = parseIOCFile(argv.new, argv.newFormat);

const diff = diffIOCs(oldIOCs, newIOCs, {
  fuzzyMatch: argv.fuzzy,
  fuzzyThreshold: argv.threshold,
  matchBy: 'value+type',
  compareSeverity: true,
  compareTags: true
});

console.log(JSON.stringify(diff, null, 2));