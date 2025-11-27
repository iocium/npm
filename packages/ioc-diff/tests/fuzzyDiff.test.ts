import { diffIOCs } from '../src/diffIOCs';
import type { IOC } from '../src/types';

describe('Fuzzy IOC diffing', () => {
  const baseIOC: IOC = {
    value: 'login.microsoftonline.com',
    type: 'domain',
    tags: ['auth'],
    severity: 'medium'
  };

  const fuzzyIOC: IOC = {
    value: 'login.micr0softonline.com', // typo / obfuscation
    type: 'domain',
    tags: ['auth'],
    severity: 'medium'
  };

  it('detects fuzzy match as change when enabled', () => {
    const result = diffIOCs([baseIOC], [fuzzyIOC], {
      matchBy: 'value+type',
      fuzzyMatch: true,
      fuzzyThreshold: 0.85
    });

    expect(result.changed.length).toBe(1);
    expect(result.changed[0].before.value).toBe('login.microsoftonline.com');
    expect(result.changed[0].after.value).toBe('login.micr0softonline.com');
  });

  it('treats fuzzy match as added when fuzzyMatch is disabled', () => {
    const result = diffIOCs([baseIOC], [fuzzyIOC], {
      matchBy: 'value+type',
      fuzzyMatch: false
    });

    expect(result.added.length).toBe(1);
    expect(result.removed.length).toBe(1);
    expect(result.changed.length).toBe(0);
  });

  it('respects fuzzy threshold settings', () => {
    const result = diffIOCs([baseIOC], [fuzzyIOC], {
      matchBy: 'value+type',
      fuzzyMatch: true,
      fuzzyThreshold: 0.99
    });

    // Similarity is below 0.99, so it should not be a fuzzy match
    expect(result.changed.length).toBe(0);
    expect(result.added.length).toBe(1);
    expect(result.removed.length).toBe(1);
  });

  it('executes changed.push when severity differs on same key', () => {
    const oldIOCs: IOC[] = [
      { value: 'malicious.com', type: 'domain', severity: 'low' }
    ];
    const newIOCs: IOC[] = [
      { value: 'malicious.com', type: 'domain', severity: 'high' }
    ];

    const result = diffIOCs(oldIOCs, newIOCs, {
      matchBy: 'value+type',
      compareSeverity: true
    });

    expect(result.changed.length).toBe(1);
    expect(result.changed[0].before.severity).toBe('low');
    expect(result.changed[0].after.severity).toBe('high');
  });
});