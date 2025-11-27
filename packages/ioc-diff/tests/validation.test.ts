import { parsePlainIOCs } from '../src/utils';
import type { IOC } from '../src/types';

describe('IOC validation and normalization', () => {
  it('parses valid IPs, URLs, hashes, domains, and emails', () => {
    const input = [
      '1.2.3.4',
      'https://example.com/path',
      'D41D8CD98F00B204E9800998ECF8427E', // MD5
      'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', // SHA256
      'test@example.com',
      'example.org'
    ];

    const result = parsePlainIOCs(input);

    const types = result.map(i => i.type);
    expect(types).toContain('ip');
    expect(types).toContain('url');
    expect(types).toContain('md5');
    expect(types).toContain('sha256');
    expect(types).toContain('email');
    expect(types).toContain('domain');
  });

  it('filters out blatantly invalid lines', () => {
    const input = [
      'not_a_domain',
      'htp://bad-url',
      '999.999.999.999',
      'short',
      '###'
    ];

    const result = parsePlainIOCs(input);
    expect(result).toEqual([]);
  });

  it('deduplicates IOCs based on value+type', () => {
    const input = [
      '1.2.3.4',
      '1.2.3.4 ',
      '1.2.3.4', // duplicate
      'EXAMPLE.ORG',
      'example.org' // duplicate (case-insensitive)
    ];

    const result = parsePlainIOCs(input);
    expect(result).toHaveLength(2);
    const values = result.map(i => i.value.toLowerCase());
    expect(values).toContain('1.2.3.4');
    expect(values).toContain('example.org');
  });

  it('ignores empty lines and comments', () => {
    const input = [
      '',
      '# this is a comment',
      '  ',
      '1.1.1.1'
    ];

    const result = parsePlainIOCs(input);
    expect(result).toHaveLength(1);
    expect(result[0].value).toBe('1.1.1.1');
  });
});