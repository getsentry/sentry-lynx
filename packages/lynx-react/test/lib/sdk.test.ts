import { BaseTransportOptions, Client, ClientOptions } from "@sentry/core";
import { describe, it, vi, expect, beforeEach, afterEach } from "vitest";
import { init } from "../../src";
import { initAndBind } from "@sentry/core";
import * as environment from '../../src/environment';

vi.mock('@sentry/core', async () => {
  const actual = await vi.importActual('@sentry/core');
  return {
    ...actual,
    initAndBind: vi.fn(),
  };
});

describe('sdk functionality', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('init', () => {
        it('should not initalize if not on mobile background thread or browser main thread', () => {
            vi.spyOn(environment, 'isLynxBackgroundThread').mockReturnValue(false);
            vi.spyOn(environment, 'isBrowserMainThread').mockReturnValue(false);

            init({});

            expect(initAndBind).not.toHaveBeenCalled();
        });

        it('should initalize if on mobile background thread', () => {
            vi.spyOn(environment, 'isLynxBackgroundThread').mockReturnValue(true);
            vi.spyOn(environment, 'isBrowserMainThread').mockReturnValue(false);

            init({});

            expect(initAndBind).toHaveBeenCalledOnce();
        });

        it('should initalize if on browser main thread', () => {
            vi.spyOn(environment, 'isLynxBackgroundThread').mockReturnValue(false);
            vi.spyOn(environment, 'isBrowserMainThread').mockReturnValue(true);

            init({});

            expect(initAndBind).toHaveBeenCalledOnce();
        });
    });
});
