import { IErrorBoundaryProps, IErrorMessages } from './types';
import * as Sentry from '@sentry/react';
import errorMessages from './errors';
import createErrorBoundary from './error-boundary';
import { JSXElementConstructor } from 'react';

const errorTypes = {
  api: 'api',
};

class ErrorMonitoring {
  errorTypes: { [key: string]: string };
  ErrorBoundary: JSXElementConstructor<IErrorBoundaryProps>;
  errorMessages: IErrorMessages;
  dsn: string | undefined;
  constructor() {
    this.errorTypes = errorTypes;
    this.ErrorBoundary = createErrorBoundary();
    this.errorMessages = errorMessages;
    this.dsn = process.env.SENTRY_URL;
  }

  init = () => {
    if (!this.dsn) return;
    Sentry.init({
      dsn: this.dsn,
      autoSessionTracking: true,
      tracesSampleRate: 1.0,
    });
  };

  sendMessage = (msg: string) => {
    if (!this.dsn) return;
    Sentry.captureMessage(msg);
  };

  captureException = (error: Error, section = null, customMessage = null) => {
    const { message, stack, name } = error;
    if (!this.dsn) return;
    Sentry.withScope(function (scope) {
      scope.setTag('section', section);
      scope.setTag('customMessage', customMessage);
      const contexts = {
        error: {
          name,
          message,
          stack,
        },
      };
      Sentry.captureException(error, { contexts });
    });
  };

  setUser = ({ mainAddress }: { mainAddress?: string }) => {
    if (!this.dsn || !mainAddress) return;
    Sentry.configureScope(function (scope) {
      scope.setUser({
        id: mainAddress,
      });
    });
  };
}

export default new ErrorMonitoring();
