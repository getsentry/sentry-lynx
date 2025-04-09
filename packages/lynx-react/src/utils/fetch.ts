import { isBrowserMainThread, isMobile, getLynx } from '../environment';

export function getFetch(): typeof fetch | undefined {
  if (isMobile()) {
    return getLynx()?.fetch as typeof fetch;
  }

  if (isBrowserMainThread()) {
    return undefined; // Will be resolved internally
  }

  // Most likely a web worker
  // TODO: Verify if actually a web worker else return getNativeImplementation default fetch
  // Internal fetch resolution doesn't work for web workers and globalThis.fetch is also undefined
  // https://github.com/getsentry/sentry-javascript/blob/de2c1ad309b850c1254c69890c96e869e297fa4c/packages/browser-utils/src/getNativeImplementation.ts#L27
  return fetch;
}
