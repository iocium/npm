import { diffIOCs } from '../src/diffIOCs';
import type { IOC } from '../src/types';

describe('default behavior', () => {
  it('uses default matchBy = "value" when options are undefined', () => {
    const oldIOCs: IOC[] = [
      { value: '1.1.1.1', type: 'ip' }
    ];
    const newIOCs: IOC[] = [
      { value: '1.1.1.1', type: 'ip' },
      { value: '2.2.2.2', type: 'ip' }
    ];

    const result = diffIOCs(oldIOCs, newIOCs);
    expect(result.added.length).toBe(1);
    expect(result.added[0].value).toBe('2.2.2.2');
  });

  it('triggers return true from tag comparison only', () => {
    const oldIOCs: IOC[] = [
      { value: 'example.com', type: 'domain', tags: ['one'], severity: 'medium' }
    ];
    const newIOCs: IOC[] = [
      { value: 'example.com', type: 'domain', tags: ['two'], severity: 'medium' }
    ];
  
    const result = diffIOCs(oldIOCs, newIOCs, {
      matchBy: 'value+type',
      compareTags: true,       // ← triggers tag diff
      compareSeverity: false   // ← disables line 19
    });
  
    expect(result.changed.length).toBe(1);
    expect(result.changed[0].before.tags).toEqual(['one']);
    expect(result.changed[0].after.tags).toEqual(['two']);
  });
});