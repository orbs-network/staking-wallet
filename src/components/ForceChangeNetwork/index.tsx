import { Button, Typography } from '@material-ui/core';
import React, { ReactNode, useEffect } from 'react';
import LinkOffIcon from '@material-ui/icons/LinkOff';
import { makeStyles } from '@material-ui/styles';
import { triggerNetworkChange } from '../../utils/web3';
import config from '../../config';
import { CommonActionButton } from '../base/CommonActionButton';

const useStyles = makeStyles({
  container: {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    zIndex: 9999,
  },
  containerContent: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    flexDirection: 'column',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 10,
    paddingRight: 10,
  },
  title: {
    marginBottom: 10,
    fontSize: 30,
    fontWeight: 500,
    textAlign: 'center',
  },
  icon: {
    fontSize: 60,
  },
  text: {
    marginTop: 10,
    fontSize: 15,
    textAlign: 'center',
  },
  overlay: {
    width: '100%',
    height: '100%',
    background: 'black',
    opacity: '0.9',
  },
});
interface IProps {
  chain: string;
}
function ForceChangeNetwork({ chain }: IProps) {
  const { name, nativeCurrency, rpcUrls, blockExplorerUrls } = config.networks[chain];

  const onSubmit = () => {
    triggerNetworkChange(chain, { chainName: name, nativeCurrency, rpcUrls, blockExplorerUrls });
  };

  const classes = useStyles();
  return (
    <div className={classes.container}>
      <section className={classes.overlay}></section>
      <div className={classes.containerContent}>
        <Typography className={classes.title}>Welcome</Typography>
        <Typography className={classes.text}>Please change the network to {name} </Typography>
        <CommonActionButton style={{ marginTop: 20 }} onClick={onSubmit}>
          change to {name}{' '}
        </CommonActionButton>
      </div>
    </div>
  );
}

export default ForceChangeNetwork;
