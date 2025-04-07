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
import { isBrowserMainThread, notMobile } from './environment';
import { getFetch } from './utils/fetch';
import { developmentSymbolicatorIntegration } from './integrations/developmentSymbolicator';

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
    developmentSymbolicatorIntegration(),
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
 * import { init } from '@sentry/lynx-react';
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
 * import { addBreadcrumb } from '@sentry/lynx-react';
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
 * import * as Sentry from '@sentry/lynx-react';
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
