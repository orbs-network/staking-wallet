import React, { useState } from 'react';
import { Snackbar } from '@material-ui/core';
import { CustomSnackBarContent } from '../../../snackbar/CustomSnackBarContent';

function useSnackBar(message: string) {
  const [show, setShow] = useState(false);
  const showSnackbar = () => {
    setShow(true);
  };
  const snackbar = (
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      open={show}
      autoHideDuration={1200}
      onClose={() => setShow(false)}
    >
      <CustomSnackBarContent
        variant={'success'}
        message={message}
        onClose={() => setShow(false)}
        data-testid={'message-address-was-copied'}
      />
    </Snackbar>
  );
  return { snackbar, showSnackbar };
}

export default useSnackBar;
