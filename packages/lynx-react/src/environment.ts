import { UnsafeLynx } from '@lynx-js/types';

export function isLynx(): boolean {
  return !!globalThis.lynx;
}

export function isAndroid(): boolean {
  // SystemInfo.platform type suggest this always exists,
  // but in browser lynx workers SystemInfo is empty object
  return globalThis.SystemInfo?.platform === 'Android';
}

export function isIOS(): boolean {
  // SystemInfo.platform type suggest this always exists,
  // but in browser lynx workers SystemInfo is empty object
  return globalThis.SystemInfo?.platform === 'iOS';
}

export function isMobile(): boolean {
  return isAndroid() || isIOS();
}

export function notMobile(): boolean {
  return !isMobile();
}

export function isNodeLike(): boolean {
  return (
    Object.prototype.toString.call(typeof process !== 'undefined' ? process : 0) === '[object process]'
  );
}

export function isLynxBackgroundThread(): boolean {
  return typeof __BACKGROUND__ !== 'undefined' && __BACKGROUND__;
}

export function getLynx(): UnsafeLynx | undefined {
  if (typeof lynx === 'undefined') {
    return undefined;
  }
  return lynx;
}

declare const window: unknown;

export function isBrowserMainThread(): boolean {
  return  typeof window !== 'undefined' && !isNodeLike() && notMobile();
}

// TODO: Add isWebWorker
// TODO: Add isLynxWebBackgroundWorker
// TODO: Add isLynxWebMainThreadWorker
