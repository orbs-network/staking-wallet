import React, { ReactNode, useState } from 'react';
import { Snackbar } from '@material-ui/core';
import { CustomSnackBarContent } from './CustomSnackBarContent';

interface IProps {
  message: string | ReactNode;
  show: boolean;
  hide: () => void;
  variant: 'success' | 'warning' | 'error' | 'info';
  testId?: string;
  autoHideDuration?: number;
  withoutAutoHide?: boolean;
}

const CustomSnackbar = ({
  message,
  hide,
  show,
  testId = '',
  variant,
  autoHideDuration = 2000,
  withoutAutoHide,
}: IProps) => {
  return !show ? null : (
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      open={true}
      autoHideDuration={withoutAutoHide ? null : autoHideDuration}
      onClose={(event, reason) => {
        if (reason !== 'clickaway') {
          hide();
        }
      }}
    >
      <CustomSnackBarContent variant={variant} message={message} onClose={hide} data-testid={testId} />
    </Snackbar>
  );
};

export default CustomSnackbar;
