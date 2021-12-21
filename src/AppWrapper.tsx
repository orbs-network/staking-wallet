import React from 'react';
import { App } from './App';
import ErrorMonitoring from './services/error-monitoring/index';
import './services/i18n/index';
import NetworkWrapper from './wrappers/NetworkWrapper';

export const AppWrapper = () => {
  return (
    <NetworkWrapper>
      <App />
    </NetworkWrapper>
  );
};
