import * as Sentry from '@sentry/react';

const init = () => {
  Sentry.init({
    dsn: `https://59e154dbf5c94d8e8136bb1532ac152f@o813886.ingest.sentry.io/${process.env.SENTRY_USER_ID}`,

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
  });
};

const sendMessage = (msg: string) => {
  Sentry.captureMessage(msg);
};

const captureExeption = (err: Error) => {
  Sentry.captureException(err);
};

const errorMonitoring = {
  init,
  sendMessage,
  captureExeption,
};
export default errorMonitoring;
