import * as Sentry from '@sentry/react';
const dsn = process.env.SENTRY_URL;
const init = () => {
  if (!dsn) return;
  Sentry.init({
    dsn,
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
  });
};

const sendMessage = (msg: string) => {
  if (!dsn) return;
  Sentry.captureMessage(msg);
};

const captureExeption = (err: Error) => {
  if (!dsn) return;
  Sentry.captureException(err);
};

const errorMonitoring = {
  init,
  sendMessage,
  captureExeption,
};
export default errorMonitoring;
