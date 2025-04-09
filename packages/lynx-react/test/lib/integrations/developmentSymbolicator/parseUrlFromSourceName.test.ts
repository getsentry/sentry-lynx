import { describe, it, expect } from 'vitest';
import { parseUrlFromSourceName } from '../../../../src/integrations/developmentSymbolicator';

describe('parseUrlFromSourceName', () => {
  it('should return the localhost url from the source name', () => {
    expect(parseUrlFromSourceName('http://localhost:3000/main.lynx.bundle')).toBe('http://localhost:3000');
  });

  it('should return the localhost url from the source name with a query string', () => {
    expect(parseUrlFromSourceName('http://localhost:3000/main.lynx.bundle?fullscreen=true')).toBe('http://localhost:3000');
  });

  it('should return the ip url from the source name', () => {
    expect(parseUrlFromSourceName('http://192.168.0.94:3000/main.lynx.bundle')).toBe('http://192.168.0.94:3000');
  });

  it('should return the ip url from the source name with a query string', () => {
    expect(parseUrlFromSourceName('http://192.168.0.94:3000/main.lynx.bundle?fullscreen=true')).toBe('http://192.168.0.94:3000');
  });

  it('should return the url from the source name with custom protocol', () => {
    expect(parseUrlFromSourceName('custom://192.168.0.94:3000')).toBe('custom://192.168.0.94:3000');
  });
});
