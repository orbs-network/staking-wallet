import React, { useState } from 'react';
import { Snackbar } from '@material-ui/core';
import { CustomSnackBarContent } from './CustomSnackBarContent';

interface IProps {
  message: string;
  show: boolean;
  hide: () => void;
  variant: 'success' | 'warning' | 'error' | 'info';
  testId: string;
  autoHideDuration?: number;
}

const CustomSnackbar = ({ message, hide, show, testId, variant, autoHideDuration = 2000 }: IProps) => {
  return show ? (
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      open={true}
      autoHideDuration={autoHideDuration}
      onClose={hide}
    >
      <CustomSnackBarContent variant={variant} message={message} onClose={hide} data-testid={testId} />
    </Snackbar>
  ) : null;
};

export default CustomSnackbar;
