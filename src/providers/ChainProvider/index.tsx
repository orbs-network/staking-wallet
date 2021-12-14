import { Typography } from '@material-ui/core';
import React, { ReactNode, useContext } from 'react';
import LinkOffIcon from '@material-ui/icons/LinkOff';
import useStyles from './styles';

interface IProps {
  chainId: string;
  children: ReactNode;
}

const ChainProvider = ({ chainId, children }: IProps) => {
  const classes = useStyles();

  if (!JSON.parse(process.env.TARGET_NETWORKS).includes(Number(chainId))) {
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
  return <>{children}</>;
};

export default ChainProvider;
