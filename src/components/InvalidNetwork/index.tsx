import { Typography } from '@material-ui/core';
import React, { ReactNode } from 'react';
import LinkOffIcon from '@material-ui/icons/LinkOff';
import { makeStyles } from '@material-ui/styles';

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

function InvalidNetwork() {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <section className={classes.overlay}></section>
      <div className={classes.containerContent}>
        <Typography className={classes.title}>Oops, wrong network!</Typography>
        <LinkOffIcon className={classes.icon} />
        <Typography className={classes.text}>Please change the network to Ethereum Mainnet or Polygon </Typography>
      </div>
    </div>
  );
}

export default InvalidNetwork;
