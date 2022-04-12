import { Typography } from '@material-ui/core';
import React, { useContext, useEffect } from 'react';
import LinkOffIcon from '@material-ui/icons/LinkOff';
import { NETWORK_QUERY_PARAM } from '../../constants';
import { useHistory, useLocation } from 'react-router';
import { removeQueryParam } from '../../utils/url';
import config, { INetwork } from '../../../config';
import { CommonActionButton } from '../base/CommonActionButton';
import { useStyles } from './styles';
import { getSupportedChains } from '../../utils';
import useWeb3 from '../../hooks/useWeb3';
import { MobXProviderContext } from 'mobx-react';


const availableChains = getSupportedChains();

function WrongNetwork() {
  const classes = useStyles();
  const {chainId} = useContext(MobXProviderContext)

  return (
    <div className={classes.container}>
      <section className={classes.overlay}></section>
      <div className={classes.containerContent}>
        <Typography className={classes.title}>Oops, wrong network!</Typography>
        <LinkOffIcon className={classes.icon} />
        <Typography className={classes.text}>Please change the network</Typography>
        <div className={classes.btnsContainer}>
          {availableChains
            .filter((c) => c !== chainId)
            .map((chain, index) => {
              const network = config.networks[chain];
              if (!network) {
                return null;
              }
              return (
                <Typography className={classes.networkBtn} key={index}>
                  {network.name}
                </Typography>
              );
            })}
        </div>
      </div>
    </div>
  );
}

export default WrongNetwork;
