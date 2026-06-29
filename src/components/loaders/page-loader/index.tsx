import React from 'react';
import SpinnerLoader from '../loader-components/spinner';
import Dialog from '@material-ui/core/Dialog';

interface IProps {
  open: boolean;
}

function PageLoader({ open }: IProps) {
  return (
    <Dialog
      open={open}
      onClose={() => {}}
      disableScrollLock
      style={{ border: 'none' }}
      PaperProps={{
        style: {
          alignItems: 'center',
          background: 'transparent',
          boxShadow: 'none',
          display: 'flex',
          height: 120,
          justifyContent: 'center',
          margin: 0,
          overflow: 'hidden',
          width: 120,
        },
      }}
    >
      <SpinnerLoader style={{ width: '100px', height: '100px' }} />
    </Dialog>
  );
}

export default PageLoader;
