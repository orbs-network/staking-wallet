import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import { DialogProps } from '@material-ui/core/Dialog/Dialog';
import styled from 'styled-components';
import { Backdrop } from '@material-ui/core';

const DarkBackdrop = styled(Backdrop)(() => ({
  backgroundColor: 'rgba(0, 0, 0, 0.9)',
}));

export const CommonDialog = React.memo<DialogProps>(props => {
  const { children, ...others } = props;

  return (
    <Dialog style={{ }} disableBackdropClick BackdropComponent={DarkBackdrop} {...others}>
      {children}
    </Dialog>
  );
});
