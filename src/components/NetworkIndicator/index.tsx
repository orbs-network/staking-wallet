import { Typography } from '@material-ui/core';
import React from 'react';
import useNetwork from '../hooks/useNetwork';
import { useNetworkIndicatorStyles } from './styles';

const NetworkIndicator = () => {
  const [network, chainId] = useNetwork();
  const classes = useNetworkIndicatorStyles();
  if (process.env.NODE_ENV !== 'production') {
    return <div className={classes.devContainer}>{network}</div>;
  }

  if (chainId && chainId !== process.env.CHAIN_ID) {
    return (
      <div className={classes.prodContainer}>
        <section className={classes.overlay}></section>
        <div className={classes.prodContainerContent}>
          <Typography>Please connect to Mainnet</Typography>
        </div>
      </div>
    );
  }
  return null;
};

export default NetworkIndicator;
