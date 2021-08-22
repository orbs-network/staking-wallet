import { Button, Typography } from '@material-ui/core';
import React from 'react';
import useNetwork from '../hooks/useNetwork';
import { useNetworkIndicatorStyles } from './styles';
import LinkOffIcon from '@material-ui/icons/LinkOff';
import { makeStyles } from '@material-ui/core/styles';

const NetworkIndicator = () => {
  const [network, chainId] = useNetwork();
  const classes = useNetworkIndicatorStyles();
  if (!process.env.TARGET_NETWORK) {
    return <div className={classes.devContainer}>{network}</div>;
  }

  if (chainId && chainId !== process.env.TARGET_NETWORK) {
    return (
      <div className={classes.prodContainer}>
        <section className={classes.overlay}></section>
        <div className={classes.prodContainerContent}>
          <Typography className={classes.title}>Oops, wrong network!</Typography>
          <LinkOffIcon className={classes.icon} />
          <Typography className={classes.text}>Please change the network to Ethereum Mainnet </Typography>
        </div>
      </div>
    );
  }
  return null;
};

export default NetworkIndicator;
