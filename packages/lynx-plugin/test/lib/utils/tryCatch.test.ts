import { describe, expect, it } from 'vitest';
import { tryCatch } from '../../../src/utils/tryCatch';

describe('tryCatch', () => {
  it('handles successful synchronous execution', () => {
    const result = tryCatch(() => 'success');
    expect(result).toEqual({
      data: 'success',
      error: null,
    });
  });

  it('handles synchronous error', () => {
    const error = new Error('sync error');
    const result = tryCatch(() => {
      throw error;
    });
    expect(result).toEqual({
      data: null,
      error,
    });
  });

  it('handles successful async execution', async () => {
    const result = await tryCatch(async () => 'async success');
    expect(result).toEqual({
      data: 'async success',
      error: null,
    });
  });

  it('handles async rejection', async () => {
    const error = new Error('async error');
    const result = await tryCatch(async () => {
      throw error;
    });
    expect(result).toEqual({
      data: null,
      error,
    });
  });

  it('handles Promise.reject', async () => {
    const error = new Error('rejected promise');
    const result = await tryCatch(() => Promise.reject(error));
    expect(result).toEqual({
      data: null,
      error,
    });
  });

  it('handles non-Error throws - string', () => {
    const result = tryCatch((): unknown => {
      throw 'string error'; // eslint-disable-line no-throw-literal
    });
    expect(result.data).toBeNull();
    expect(result.error).toBeInstanceOf(Error);
  });

  it('handles non-Error throws - number', () => {
    const result = tryCatch((): unknown => {
      throw 123; // eslint-disable-line no-throw-literal
    });
    expect(result.data).toBeNull();
    expect(result.error).toBeInstanceOf(Error);
  });

  it('handles non-Error throws - undefined', () => {
    const result = tryCatch((): unknown => {
      throw undefined; // eslint-disable-line no-throw-literal
    });
    expect(result.data).toBeNull();
    expect(result.error).toBeInstanceOf(Error);
  });
});