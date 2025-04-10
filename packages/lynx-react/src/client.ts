import type {
  BaseTransportOptions,
  ClientOptions,
  Event,
  EventHint,
  Options,
  ParameterizedString,
  Scope,
  SeverityLevel,
} from '@sentry/core';
import {
  GLOBAL_OBJ,
  Client,
  addAutoIpAddressToSession,
  addAutoIpAddressToUser,
  makeDsn,
  logger,
} from '@sentry/core';
import { eventFromException, eventFromMessage } from '@sentry/browser';
import { SDK_VERSION } from './version';
import { getEnvelopeEndpointWithUrlEncodedAuth } from './utils/api';

export const WINDOW = GLOBAL_OBJ as typeof GLOBAL_OBJ & {
  document: any;
};

type SharedOptions = 'dsn'
  | 'integrations'
  | 'debug'
  | 'beforeSend'
  | 'attachStacktrace'
  | 'transport'
  | 'stackParser'
  | 'release'
  | 'sendClientReports'
  | 'sendDefaultPii'
  | 'transportOptions';

/**
 * Configuration options for the Sentry Lynx SDK.
 * @see @sentry/core Options for more information.
 */
export type LynxOptions = Pick<
  Options<BaseTransportOptions>,
  SharedOptions | 'defaultIntegrations'
>;

/**
 * Configuration options for the Sentry Lynx SDK Client class
 * @see LynxClient for more information.
 */
export type LynxClientOptions = Pick<
  ClientOptions<BaseTransportOptions>,
  SharedOptions | '_metadata'
>;

/**
 * The Sentry Lynx SDK Client.
 *
 * @see LynxOptions for documentation on configuration options.
 * @see SentryClient for usage documentation.
 */
export class LynxClient extends Client<LynxClientOptions> {
  /**
   * Creates a new Lynx SDK instance.
   *
   * @param options Configuration options for this SDK.
   */
  public constructor(options: LynxClientOptions) {
    const opts = {
      // We default this to true, as it is the safer scenario
      parentSpanIsAlwaysRootSpan: true,
      ...options,
      // TODO: Temporary fix for URLSearchParams not defined in Lynx
      dsn: undefined,
    };
    applySdkMetadata(opts, 'lynx.react', ['lynx-react']);

    super(opts);

    // TODO: Temporary fix for URLSearchParams not defined in Lynx
    if (options.dsn) {
      // @ts-ignore _dsn is read-only
      this._dsn = makeDsn(options.dsn);
    } else {
      logger.warn('No DSN provided, client will not send events.');
    }

    if (this._dsn) {
      const url = getEnvelopeEndpointWithUrlEncodedAuth(
        this._dsn,
        undefined,
        opts._metadata ? opts._metadata.sdk : undefined,
      );
      // @ts-ignore _transport is read-only
      this._transport = options.transport({
        recordDroppedEvent: this.recordDroppedEvent.bind(this),
        ...opts.transportOptions,
        url,
      });
    }
    // TODO: End Of Temporary fix for URLSearchParams not defined in Lynx

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const client = this;
    const { sendDefaultPii, } = client._options;

    if (opts.sendClientReports && WINDOW.document) {
      WINDOW.document.addEventListener('visibilitychange', () => {
        if (WINDOW.document.visibilityState === 'hidden') {
          this._flushOutcomes();
        }
      });
    }

    if (sendDefaultPii) {
      client.on('postprocessEvent', addAutoIpAddressToUser);
      client.on('beforeSendSession', addAutoIpAddressToSession);
    }
  }

  /**
   * @inheritDoc
   */
  public eventFromException(exception: unknown, hint?: EventHint): PromiseLike<Event> {
    return eventFromException(this._options.stackParser, exception, hint, this._options.attachStacktrace);
  }

  /**
   * @inheritDoc
   */
  public eventFromMessage(
    message: ParameterizedString,
    level: SeverityLevel = 'info',
    hint?: EventHint,
  ): PromiseLike<Event> {
    return eventFromMessage(this._options.stackParser, message, level, hint, this._options.attachStacktrace);
  }

  /**
   * @inheritDoc
   */
  protected _prepareEvent(
    event: Event,
    hint: EventHint,
    currentScope: Scope,
    isolationScope: Scope,
  ): PromiseLike<Event | null> {
    event.platform = event.platform || 'javascript';

    return super._prepareEvent(event, hint, currentScope, isolationScope);
  }
}

/**
 * A builder for the SDK metadata in the options for the SDK initialization.
 *
 * Note: This function is identical to `buildMetadata` in Remix and NextJS and SvelteKit.
 * We don't extract it for bundle size reasons.
 * @see https://github.com/getsentry/sentry-javascript/pull/7404
 * @see https://github.com/getsentry/sentry-javascript/pull/4196
 *
 * If you make changes to this function consider updating the others as well.
 *
 * @param options SDK options object that gets mutated
 * @param names list of package names
 */
export function applySdkMetadata(options: Options, name: string, names: string[] = [], source = 'npm'): void {
  const metadata = options._metadata || {};

  if (!metadata.sdk) {
    metadata.sdk = {
      name: `sentry.javascript.${name}`,
      packages: names.map(name => ({
        name: `${source}:@sentry/${name}`,
        version: SDK_VERSION,
      })),
      version: SDK_VERSION,
    };
  }

  options._metadata = metadata;
}
