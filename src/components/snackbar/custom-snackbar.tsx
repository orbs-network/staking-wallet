import React, { ReactNode, useEffect, useState } from 'react';
import IconButton from '@material-ui/core/IconButton';
import { useSnackbar } from 'notistack';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from '@material-ui/core/styles';
import SnackbarContent from './SnackbarContent';
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

const useStyles = makeStyles({
  root: {
    '& .notistack-snackbar': {
      backgroundColor: 'yellow',
    },
  },
});

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
  const classes = useStyles();

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
        content: (key) => (
          <SnackbarContent variant={variant} onClose={() => closeSnackbar(key)}>
            {message}
          </SnackbarContent>
        ),
        onExit: hide,
        autoHideDuration: withoutAutoHide ? null : autoHideDuration,
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
