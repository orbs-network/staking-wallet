import React, { FC, JSXElementConstructor } from 'react';
import * as Sentry from '@sentry/react';
import AppFallback from '../../components/fallback/index';
import { IErrorBoundaryProps } from './types';

const createErrorBoundary = (): JSXElementConstructor<IErrorBoundaryProps> => {
  return ({ children }: IErrorBoundaryProps) => {
    return <Sentry.ErrorBoundary fallback={<AppFallback />}>{children}</Sentry.ErrorBoundary>;
  };
};

export default createErrorBoundary;
