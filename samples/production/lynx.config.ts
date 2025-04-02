import { pluginQRCode } from '@lynx-js/qrcode-rsbuild-plugin';
import { pluginReactLynx } from '@lynx-js/react-rsbuild-plugin';
import { defineConfig } from '@lynx-js/rspeedy';
import { sentryWebpackPlugin } from '@sentry/webpack-plugin';
export default defineConfig({
  plugins: [
    pluginQRCode({
      schema(url) {
        // We use `?fullscreen=true` to open the page in LynxExplorer in full screen mode
        return `${url}?fullscreen=true`;
      },
    }),
    pluginReactLynx(),
  ],
  output: {
    sourceMap: {
      js: 'source-map',
    },
    filename: 'example.lynx.bundle'
  },
  tools: {
    rspack: {
      plugins: [
        sentryWebpackPlugin({
          authToken: process.env.SENTRY_AUTH_TOKEN,
          org: 'sentry-sdks',
          project: 'sentry-flutter',
        })
      ]
    }
  }
});
