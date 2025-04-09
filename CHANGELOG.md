# Changelog

## Unreleased

- Automatic upload of background thread source maps when building the app
- Automatic report caught unhandled errors in the background thread to Sentry 
- Local symbolication of stacktraces in debug mode
- API for manually reporting errors with `Sentry.captureException`
