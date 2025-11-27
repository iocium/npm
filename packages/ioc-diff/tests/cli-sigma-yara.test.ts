import { diffIOCs } from '../src/diffIOCs';
import type { IOC } from '../src/types';

// Sample YARA rule content
const yaraOld = `
rule MaliciousExample {
  strings:
    $a = "evil.com"
    $b = "bad.com"
  condition:
    any of them
}
`;

const yaraNew = `
rule MaliciousExample {
  strings:
    $a = "evil.com"
    $b = "worse.com"
  condition:
    any of them
}
`;

// Simulate basic YARA parser logic from CLI
function parseYara(raw: string): IOC[] {
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

// Sample Sigma rule content
const sigmaOld = `
title: Suspicious Domain Access
detection:
  selection:
    domain: evil.com
  condition: selection
`;

const sigmaNew = `
title: Suspicious Domain Access
detection:
  selection:
    domain: evil.com
    alt: worse.com
  condition: selection
`;

import yaml from 'js-yaml';

function parseSigma(raw: string): IOC[] {
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

describe('Sigma and YARA IOC diffing', () => {
  it('detects changes in YARA rules', () => {
    const oldIOCs = parseYara(yaraOld);
    const newIOCs = parseYara(yaraNew);

    const diff = diffIOCs(oldIOCs, newIOCs, {
      matchBy: 'value',
    });

    expect(diff.added.map(i => i.value)).toContain('worse.com');
    expect(diff.removed.map(i => i.value)).toContain('bad.com');
  });

  it('detects added IOCs in Sigma rules', () => {
    const oldIOCs = parseSigma(sigmaOld);
    const newIOCs = parseSigma(sigmaNew);

    const diff = diffIOCs(oldIOCs, newIOCs, {
      matchBy: 'value',
    });

    expect(diff.added.map(i => i.value)).toContain('worse.com');
    expect(diff.removed).toEqual([]); // 'evil.com' remains
  });
});