import type { RsbuildPlugin } from '@rsbuild/core'
import { sentryWebpackPlugin, type SentryWebpackPluginOptions } from '@sentry/webpack-plugin/webpack5';
import { createSentrySymbolicatorMiddleware } from './middleware';
import { logger } from '@sentry/core';
import { PREFIX } from './prefix';

/**
 * Create a rsbuild plugin for Sentry Lynx SDK.
 *
 * @example
 * ```ts
 * // lynx.config.ts
 * import { pluginSentryLynx } from '@sentry/lynx-react/plugin'
 * export default {
 *   plugins: [pluginSentryLynx({
 *     org: 'your-organization',
 *     project: 'your-project',
 *     authToken: process.env.SENTRY_AUTH_TOKEN,
 *   })],
 * }
 * ```
 *
 * @public
 */
export function pluginSentryLynx(options: SentryWebpackPluginOptions & {
  /**
   * When enabled, the plugin will use the local symbolicator to symbolicate the stack traces from development builds.
   *
   * @default true
   */
  localSymbolication?: boolean,
}): RsbuildPlugin {
  const { debug, localSymbolication = true } = options;
  if (debug) {
    logger.enable();
  }

  return {
    name: 'sentry:rsbuild:lynx',
    setup(api) {
      api.modifyRspackConfig((config) => {
        config.plugins?.push(sentryWebpackPlugin(options));
      });

      if (localSymbolication) {
        api.modifyRsbuildConfig((config) => {
          if (!config.dev) {
            logger.warn(`${PREFIX} No dev configuration found for Sentry Middleware.`);
            return;
          }

          config.dev.setupMiddlewares = [
            ...(config.dev.setupMiddlewares ?? []),
            (middlewares) => {
              middlewares.unshift(createSentrySymbolicatorMiddleware(config));
            },
          ];
        });
      }
    },
  };
}
