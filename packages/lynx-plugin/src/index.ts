import type { RsbuildPlugin } from '@rsbuild/core'
import { sentryWebpackPlugin, type SentryWebpackPluginOptions } from '@sentry/webpack-plugin';

/**
 * Create a rsbuild plugin for Sentry Lynx SDK.
 *
 * @example
 * ```ts
 * // lynx.config.ts
 * import { pluginSentryLynx } from '@sentry/lynx/plugin'
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
export function pluginSentryLynx(options: SentryWebpackPluginOptions): RsbuildPlugin {
  return {
    name: 'sentry:rsbuild:lynx',
    setup(api) {
      api.modifyRspackConfig((config) => {
        config.plugins?.push(sentryWebpackPlugin(options));
      });
    },
  }
}
