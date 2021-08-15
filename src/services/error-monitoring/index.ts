import { IErrorBoundaryProps, IErrorMessages, ISections } from './types';
import * as Sentry from '@sentry/react';
import errorMessages from './errors';
import createErrorBoundary from './error-boundary';
import { JSXElementConstructor } from 'react';
import { sections } from './constants';
import { Integrations } from '@sentry/tracing';

const dsn = process.env.SENTRY_URL;
class ErrorMonitoring {
  ErrorBoundary: JSXElementConstructor<IErrorBoundaryProps>;
  errorMessages: IErrorMessages;
  dsn: string | undefined;
  sections: ISections;
  constructor() {
    this.ErrorBoundary = createErrorBoundary();
    this.errorMessages = errorMessages;
    this.sections = sections;
  }

  init() {
    if (!dsn) return;
    Sentry.init({
      dsn: dsn,
      autoSessionTracking: true,
      tracesSampleRate: 1.0,
      integrations: [new Integrations.BrowserTracing()],
    });
  }

  sendMessage(msg: string) {
    if (!dsn) return;
    Sentry.captureMessage(msg);
  }

  captureException(error: Error, section = null, customMessage = null) {
    console.log({ error: section, customMessage });
    if (!dsn) return;
    const { message, stack, name } = error;
    Sentry.withScope(function (scope) {
      scope.setTag('section', section);

      const contexts = {
        error: {
          name,
          message,
          stack,
          customMessage,
        },
      };
      Sentry.captureException(error, { contexts });
    });
  }

  setUser({ mainAddress }: { mainAddress?: string }) {
    if (!dsn || !mainAddress) return;
    Sentry.configureScope(function (scope) {
      scope.setUser({
        id: mainAddress,
      });
    });
  }
}

export default new ErrorMonitoring();
