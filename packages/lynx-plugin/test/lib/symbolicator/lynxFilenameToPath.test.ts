import { describe, it, expect, vi } from 'vitest';
import { urlToPath, lynxUrlToPath } from '../../../src/symbolicator';
import { logger } from '@sentry/core';
import { PREFIX } from '../../../src/prefix';

describe('urlToPath', () => {
  it('should return undefined if the filename is undefined', () => {
    expect(urlToPath(undefined)).toBeUndefined();
  });

  it('should return the path of the file', () => {
    expect(urlToPath('file://view2/.rspeedy/main/background.js')).toBe('/.rspeedy/main/background.js');
  });

  it('should return the path of the file from a http url', () => {
    expect(urlToPath('http://localhost:3000/main.lynx.bundle')).toBe('/main.lynx.bundle');
  });

  it('should return the filename if it does not start with file:// but is a path', () => {
    expect(urlToPath('test/main.lynx.bundle')).toBe('test/main.lynx.bundle');
  });

  it('should log a warning if the filename is not a valid URL', () => {
    const warnSpy = vi.spyOn(logger, 'warn');
    urlToPath('test/main.lynx.bundle');
    expect(warnSpy).toHaveBeenCalledWith(`${PREFIX} Filename test/main.lynx.bundle is not a valid URL`);
  });
});

describe('lynxUrlToPath', () => {
  it('should return undefined if the filename is undefined', () => {
    expect(lynxUrlToPath(undefined)).toBeUndefined();
  });

  it('should log a warning if the filename does not start with file://', () => {
    const warnSpy = vi.spyOn(logger, 'warn');
    lynxUrlToPath('http://localhost:3000/main.lynx.bundle');
    expect(warnSpy).toHaveBeenCalledWith(`${PREFIX} Filename http://localhost:3000/main.lynx.bundle does not start with file://`);
  });

  it('should return the path of the file', () => {
    expect(lynxUrlToPath('file://view2/.rspeedy/main/background.js')).toBe('.rspeedy/main/background.js');
  });

  it('should return the path of the file from a http url', () => {
    expect(lynxUrlToPath('http://localhost:3000/main.lynx.bundle')).toBe('main.lynx.bundle');
  });
});
