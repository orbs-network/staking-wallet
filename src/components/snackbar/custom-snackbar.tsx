import React, { useState } from 'react';
import { Snackbar } from '@material-ui/core';
import { CustomSnackBarContent } from './CustomSnackBarContent';

interface IProps {
  message: string;
  show: boolean;
  hide: () => void;
}

const CustomSnackbar = ({ message, hide, show }: IProps) => {
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
      <CustomSnackBarContent
        variant={'success'}
        message={message}
        onClose={hide}
        data-testid={'message-address-was-copied'}
      />
    </Snackbar>
  ) : null;
};

export default CustomSnackbar;
