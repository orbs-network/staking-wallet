import React from 'react';
import SpinnerLoader from '../loader-components/spinner';
import Dialog from '@material-ui/core/Dialog';

interface Props {
  open: boolean;
}

function PageLoader({ open }: Props) {
  return (
    <Dialog
      open={open}
      onClose={() => {}}
      style={{ border: 'none' }}
      PaperProps={{ style: { background: 'transparent', boxShadow:'none' } }}
    >
      <SpinnerLoader style={{ width: '100px', height: '100px' }} />
    </Dialog>
  );
}

export default PageLoader;
