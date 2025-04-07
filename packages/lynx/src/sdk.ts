import type { Client, Integration, Options } from '@sentry/core';
import {
  dedupeIntegration,
  functionToStringIntegration,
  getIntegrationsToSetup,
  GLOBAL_OBJ,
  inboundFiltersIntegration,
  initAndBind,
  logger,
  stackParserFromStackParserOptions,
  supportsFetch,
} from '@sentry/core';
import type { LynxClientOptions, LynxOptions } from './client';
import { LynxClient } from './client';
import { breadcrumbsIntegration, browserApiErrorsIntegration, browserSessionIntegration, globalHandlersIntegration } from '@sentry/browser';
import { httpContextIntegration } from '@sentry/browser';
import { linkedErrorsIntegration } from '@sentry/browser';
import { defaultStackParser } from '@sentry/browser';
import { makeFetchTransport } from '@sentry/browser';
import { dropTopLevelUndefinedKeys } from './utils/dropTopLevelUndefinedKeys';
import { getLynx, isBrowserMainThread, isMobile, notMobile } from './environment';

/** Get the default integrations for the Lynx SDK. */
export function getDefaultIntegrations(_options: Options): Integration[] {
  const integrations = [
    // TODO(v10): Replace with `eventFiltersIntegration` once we remove the deprecated `inboundFiltersIntegration`
    // eslint-disable-next-line deprecation/deprecation
    inboundFiltersIntegration(),
    functionToStringIntegration(),
    breadcrumbsIntegration({
      history: false,
      dom: false,
    }),
    linkedErrorsIntegration(),
    dedupeIntegration(),
    httpContextIntegration(),
  ];

  if (isBrowserMainThread()) {
    integrations.push(
      browserApiErrorsIntegration(),
      globalHandlersIntegration(),
      browserSessionIntegration(),
    );
  }

  return integrations;
}

/** Exported only for tests. */
export function applyDefaultOptions(optionsArg: LynxOptions = {}): LynxOptions {
  const defaultOptions: LynxOptions = {
    defaultIntegrations: getDefaultIntegrations(optionsArg),
    release: GLOBAL_OBJ.SENTRY_RELEASE?.id, // This supports the variable that sentry-webpack-plugin injects
    sendClientReports: true,
  };

  return {
    ...defaultOptions,
    ...dropTopLevelUndefinedKeys(optionsArg),
  };
}

/**
 * The Sentry Lynx SDK Client.
 *
 * To use this SDK, call the {@link init} function as early as possible when
 * loading the application. To set context information or send manual events, use
 * the provided methods.
 *
 * @example
 *
 * ```
 *
 * import { init } from '@sentry/lynx';
 *
 * init({
 *   dsn: '__DSN__',
 *   // ...
 * });
 * ```
 *
 * @example
 * ```
 *
 * import { addBreadcrumb } from '@sentry/lynx';
 * addBreadcrumb({
 *   message: 'My Breadcrumb',
 *   // ...
 * });
 * ```
 *
 * @example
 *
 * ```
 *
 * import * as Sentry from '@sentry/lynx';
 * Sentry.captureMessage('Hello, world!');
 * Sentry.captureException(new Error('Good bye'));
 * Sentry.captureEvent({
 *   message: 'Manual',
 *   stacktrace: [
 *     // ...
 *   ],
 * });
 * ```
 *
 * @see {@link LynxOptions} for documentation on configuration options.
 */
export function init(lynxOptions: LynxOptions = {}): Client | undefined {
  const options = applyDefaultOptions(lynxOptions);

  if (!supportsFetch() && notMobile()) {
    logger.warn(
      'No Fetch API detected. The Sentry SDK requires a Fetch API compatible environment to send events. Please add a Fetch API polyfill.',
    );
  }
  const clientOptions: LynxClientOptions = {
    ...options,
    stackParser: stackParserFromStackParserOptions(options.stackParser || defaultStackParser),
    integrations: getIntegrationsToSetup(options),
    transport: options.transport || ((transportOptions) => makeFetchTransport(transportOptions, getFetch())),
  };

  return initAndBind(LynxClient, clientOptions);
}

export function getFetch(): typeof lynx.fetch | typeof fetch | undefined {
  if (isMobile()) {
    return getLynx()?.fetch;
  }

  if (isBrowserMainThread()) {
    undefined; // Will be resolved internally
  }

  // Most likely a web worker
  // TODO: Verify if actually a web worker else return getNativeImplementation default fetch
  // Internal fetch resolution doesn't work for web workers and globalThis.fetch is also undefined
  // https://github.com/getsentry/sentry-javascript/blob/de2c1ad309b850c1254c69890c96e869e297fa4c/packages/browser-utils/src/getNativeImplementation.ts#L27
  return fetch;
}
