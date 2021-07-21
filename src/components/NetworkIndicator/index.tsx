import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import useNetwork from '../hooks/useNetwork';

const useStyles = makeStyles({
  container: {
    padding: '10px 20px 10px 20px',
    color: 'white',
    background: '#388e3c',
    borderRadius: '4px',
    fontSize: '16px',
    zIndex: 9999,
    fontWeight: 600,
    position: 'fixed',
    top: '20px',
    left: '50%',
    transform: 'translate(-50%)',
  },
});

const NetworkIndicator = () => {
  const [network] = useNetwork();
  const classes = useStyles();

  return network ? <div className={classes.container}>{network}</div> : null;
};

export default NetworkIndicator;
