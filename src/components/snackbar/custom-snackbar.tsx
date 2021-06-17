import React, { useState } from 'react';
import { Snackbar } from '@material-ui/core';
import { CustomSnackBarContent } from './CustomSnackBarContent';

interface IProps {
  message: string;
  show: boolean;
  hide: () => void;
  variant: 'success' | 'warning' | 'error' | 'info';
  testId: string;
}

const CustomSnackbar = ({ message, hide, show, testId, variant }: IProps) => {
  return show ? (
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      open={true}
      autoHideDuration={1200}
      onClose={hide}
    >
      <CustomSnackBarContent variant={variant} message={message} onClose={hide} data-testid={testId} />
    </Snackbar>
  ) : null;
};

export default CustomSnackbar;
