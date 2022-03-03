import React, { ReactNode, useEffect, useState } from 'react';
import IconButton from '@material-ui/core/IconButton';
import { useSnackbar } from 'notistack';
import CloseIcon from '@material-ui/icons/Close';

interface IProps {
  message: string | ReactNode;
  show: boolean;
  hide: () => void;
  variant: 'success' | 'warning' | 'error' | 'info';
  testId?: string;
  autoHideDuration?: number;
  withoutAutoHide?: boolean;
  vertical?: 'top' | 'bottom';
  horizontal?: 'left' | 'center' | 'right';
  persist?: boolean;
}

const CustomSnackbar = ({
  message,
  hide,
  show,
  testId = '',
  variant = 'warning',
  autoHideDuration = 2000,
  withoutAutoHide,
  vertical = 'bottom',
  horizontal = 'left',
  persist = false,
}: IProps) => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const notistackRef = React.createRef();

  const close = (key) => {
    hide();
    closeSnackbar(key);
  };

  const createSnackbar = () => {
    if (show && message) {
      enqueueSnackbar(message, {
        ref: notistackRef,
        variant,
        persist,
        anchorOrigin: {
          vertical: vertical,
          horizontal: horizontal,
        },
        onClose: (key) => close(key),
        autoHideDuration: withoutAutoHide ? null : autoHideDuration,
        action: (key) => (
          <IconButton key='close' aria-label='close' color='inherit' onClick={() => close(key)}>
            <CloseIcon />
          </IconButton>
        ),
      });
    }
  };

  useEffect(() => {
    if (show) {
      createSnackbar();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  return null;
};

export default CustomSnackbar;
