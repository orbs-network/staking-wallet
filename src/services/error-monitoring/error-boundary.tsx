import React, { JSXElementConstructor } from 'react';
import * as Sentry from '@sentry/react';
import { IErrorBoundaryProps } from './types';

const createErrorBoundary = (): JSXElementConstructor<IErrorBoundaryProps> => {
  return ({ children }: IErrorBoundaryProps) => {
    return <Sentry.ErrorBoundary fallback={<div></div>}>{children}</Sentry.ErrorBoundary>;
  };
};

export default createErrorBoundary;
