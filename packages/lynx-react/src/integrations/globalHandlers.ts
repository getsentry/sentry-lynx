import { captureException, Client, defineIntegration, getClient, type IntegrationFn } from "@sentry/core";
import { isLynxBackgroundThread } from "../environment";

export const INTEGRATION_NAME = 'LynxGlobalHandlers';

const createGlobalHandlersIntegration: IntegrationFn = ({
  background = true,
}: {
  /**
   * Set this to true if you want to catch unhandled errors in the background thread.
   *
   * By default set to true.
   */
  background?: boolean;
} = {}) => {
  return {
    name: INTEGRATION_NAME,
    setup: (client: Client) => {
      if (background) {
        installBackgroundUnhandledErrorHandler(client);
      }
    },
  };
};

function installBackgroundUnhandledErrorHandler(client: Client) {
    if (isLynxBackgroundThread()) {
      const app = (lynx as any).getApp()
      const originalHandleError = app.handleError;
      app.handleError = function(error: Error, originError?: Error, errorLevel?: any) {
        if (getClient() !== client) {
            return;
        }
    
        captureException(originError, (scope) => {
          scope.setLevel('fatal')
          scope.addEventProcessor((event) => {
            if (event.exception?.values?.[0]) {
              event.exception.values[0].mechanism = {
                handled: false,
                type: 'onerror',
              }
            }
            return event;
          })
          return scope;
        })
          
        originalHandleError.call(app, error, originError, errorLevel)
      }
    }
  }

/**
 * Use this integration to set up capturing unhandled errors.
 */
export const lynxGlobalHandlersIntegration = defineIntegration(createGlobalHandlersIntegration);
