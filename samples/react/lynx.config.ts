import { pluginQRCode } from '@lynx-js/qrcode-rsbuild-plugin';
import { pluginReactLynx } from '@lynx-js/react-rsbuild-plugin';
import { defineConfig } from '@lynx-js/rspeedy';
import { pluginSentryLynx } from '@sentry/lynx/plugin';

export default defineConfig({
  plugins: [
    pluginQRCode({
      schema(url) {
        // We use `?fullscreen=true` to open the page in LynxExplorer in full screen mode
        return `${url}?fullscreen=true`;
      },
    }),
    pluginReactLynx(),
    pluginSentryLynx({
      org: 'sentry-sdks',
      project: 'sentry-lynx-sample',
      authToken: process.env.SENTRY_AUTH_TOKEN,
      debug: false,
    }),
  ],
  environments: {
    web: {},
    lynx: {},
  },
  output: {
    sourceMap: {
      js: 'source-map',
    },
  },
});
