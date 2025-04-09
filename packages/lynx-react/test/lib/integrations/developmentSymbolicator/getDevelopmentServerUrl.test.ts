import { describe, it, expect, vi } from 'vitest';
import { getDevelopmentServerUrl } from '../../../../src/integrations/developmentSymbolicator';
import * as environment from '../../../../src/environment';
import { UnsafeLynx } from '@lynx-js/types';

describe('getDevelopmentServerUrl', () => {
  it('should return the localhost url from the source name', () => {
    vi.spyOn(environment, 'getLynx').mockReturnValueOnce({
      getApp: () => ({
        _params: {
          srcName: 'http://localhost:3000/main.lynx.bundle',
        },
      }),
    } as unknown as UnsafeLynx);
    expect(getDevelopmentServerUrl()).toBe('http://localhost:3000');
  });

  it('should return undefined if the app is not set', () => {
    vi.spyOn(environment, 'getLynx').mockReturnValueOnce({
      getApp: () => undefined,
    } as unknown as UnsafeLynx);
    expect(getDevelopmentServerUrl()).toBeUndefined();
  });

  it('should return undefined if the source name is not set', () => {
    vi.spyOn(environment, 'getLynx').mockReturnValueOnce({
      getApp: () => ({
        _params: {},
      }),
    } as unknown as UnsafeLynx);
    expect(getDevelopmentServerUrl()).toBeUndefined();
  });

  it('should return undefined if lynx is not set', () => {
    vi.spyOn(environment, 'getLynx').mockReturnValueOnce(undefined);
    expect(getDevelopmentServerUrl()).toBeUndefined();
  });
});
