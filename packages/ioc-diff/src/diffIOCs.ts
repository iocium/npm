import { IOC, IOCDiffResult, DiffOptions } from './types';
import { iocKey, isDifferent } from './utils';
import stringSimilarity from 'string-similarity';

/**
 * Compute the difference between two IOC datasets.
 *
 * @param oldIOCs - The baseline set of IOCs
 * @param newIOCs - The updated set of IOCs
 * @param options - Comparison behavior (e.g. match style, fuzzy match)
 * @returns An object describing added, removed, and changed IOCs
 */
export function diffIOCs(oldIOCs: IOC[], newIOCs: IOC[], options: DiffOptions = {}): IOCDiffResult {
  const matchBy = options.matchBy || 'value';
  const compareTags = options.compareTags || false;
  const compareSeverity = options.compareSeverity || false;
  const fuzzyMatch = options.fuzzyMatch || false;
  const fuzzyThreshold = options.fuzzyThreshold ?? 0.85;

  const oldMap = new Map<string, IOC>();
  const newMap = new Map<string, IOC>();

  for (const ioc of oldIOCs) {
    oldMap.set(iocKey(ioc, matchBy), ioc);
  }

  for (const ioc of newIOCs) {
    newMap.set(iocKey(ioc, matchBy), ioc);
  }

  const added: IOC[] = [];
  const removed: IOC[] = [];
  const changed: { before: IOC; after: IOC }[] = [];

  for (const [key, newIOC] of newMap.entries()) {
    if (!oldMap.has(key)) {
      let matched = false;
      if (fuzzyMatch) {
        for (const [oldKey, oldIOC] of oldMap.entries()) {
          const similarity = stringSimilarity.compareTwoStrings(
            iocKey(newIOC, matchBy),
            iocKey(oldIOC, matchBy)
          );
          if (similarity >= fuzzyThreshold) {
            changed.push({ before: oldIOC, after: newIOC });
            matched = true;
            break;
          }
        }
      }
      if (!matched) {
        added.push(newIOC);
      }
    } else {
      const oldIOC = oldMap.get(key)!;
      if (isDifferent(oldIOC, newIOC, compareTags, compareSeverity)) {
        changed.push({ before: oldIOC, after: newIOC });
      }
    }
  }

  for (const [key, oldIOC] of oldMap.entries()) {
    if (!newMap.has(key)) {
      removed.push(oldIOC);
    }
  }

  return { added, removed, changed };
}