import { IOC } from './types';
import validator from 'validator';

export function normalizeIOC(ioc: IOC): IOC {
  return {
    ...ioc,
    value: ioc.value.trim().toLowerCase(),
    type: ioc.type?.toLowerCase(),
  };
}

export function iocKey(ioc: IOC, matchBy: 'value' | 'value+type'): string {
  const norm = normalizeIOC(ioc);
  return matchBy === 'value+type' ? `${norm.value}|${norm.type}` : norm.value;
}

export function isDifferent(a: IOC, b: IOC, compareTags: boolean, compareSeverity: boolean): boolean {
  if (compareTags && JSON.stringify((a.tags || []).sort()) !== JSON.stringify((b.tags || []).sort())) return true;
  if (compareSeverity && a.severity !== b.severity) return true;
  return false;
}

function isValidDomain(value: string): boolean {
  return validator.isFQDN(value);
}

/**
 * Convert and validate a list of plain-text IOC values into structured IOC objects.
 * Attempts to infer type based on basic heuristics.
 * Filters out invalid or unrecognized IOCs.
 * Deduplicates based on value+type.
 * @param lines - Plain text IOC values
 * @returns Validated and deduplicated IOC[]
 */
export function parsePlainIOCs(lines: string[]): IOC[] {
  const seen = new Set<string>();
  const iocs: IOC[] = [];

  for (const raw of lines) {
    const value = raw.trim();
    if (!value || value.startsWith('#')) continue;

    const lower = value.toLowerCase();
    let type: string | undefined;

    if (validator.isIP(lower)) type = 'ip';
    else if (validator.isHash(lower, 'sha256')) type = 'sha256';
    else if (validator.isHash(lower, 'md5')) type = 'md5';
    else if (validator.isURL(lower, { require_protocol: true })) type = 'url';
    else if (validator.isEmail(lower)) type = 'email';
    else if (isValidDomain(lower)) type = 'domain';
    else continue;

    const key = `${lower}|${type}`;
    if (seen.has(key)) continue;
    seen.add(key);
    iocs.push({ value, type });
  }

  return iocs;
}