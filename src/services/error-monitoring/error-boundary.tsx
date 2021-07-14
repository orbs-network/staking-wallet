import React, { JSXElementConstructor } from 'react';
import * as Sentry from '@sentry/react';
import { IErrorBoundaryProps } from './types';
import ErrorComponents from '../../components/errors/error-components';

const createErrorBoundary = (): JSXElementConstructor<IErrorBoundaryProps> => {
  return ({ children }: IErrorBoundaryProps) => {
    return <Sentry.ErrorBoundary fallback={<ErrorComponents.Crash />}>{children}</Sentry.ErrorBoundary>;
  };
};

export default createErrorBoundary;
