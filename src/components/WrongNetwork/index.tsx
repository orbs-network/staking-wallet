import { Typography } from '@material-ui/core';
import React, { useEffect } from 'react';
import LinkOffIcon from '@material-ui/icons/LinkOff';
import { NETWORK_QUERY_PARAM } from '../../constants';
import { useHistory, useLocation } from 'react-router';
import { removeQueryParam } from '../../utils/url';
import { triggerNetworkChange } from '../../utils/web3';
import config, { INetwork } from '../../config';
import { CommonActionButton } from '../base/CommonActionButton';
import { useStyles } from './styles';

interface IProps {
  availableChains?: number[];
  selectedChain: number;
  forcedChain?: number;
}

function WrongNetwork({ availableChains = [], selectedChain, forcedChain }: IProps) {
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();

  const changeChain = (id: number) => {
    const network = config.networks[id];
    const { nativeCurrency, rpcUrls, blockExplorerUrls, name: chainName } = network;
    const onNetworkChanged = () => {
      removeQueryParam(NETWORK_QUERY_PARAM, history, location.search);
    };

    triggerNetworkChange(id, { chainName, nativeCurrency, rpcUrls, blockExplorerUrls }, onNetworkChanged);
  };

  useEffect(() => {
    if (forcedChain) {
      changeChain(forcedChain);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [forcedChain]);

  return (
    <div className={classes.container}>
      <section className={classes.overlay}></section>
      <div className={classes.containerContent}>
        <Typography className={classes.title}>Oops, wrong network!</Typography>
        <LinkOffIcon className={classes.icon} />
        <Typography className={classes.text}>Please change the network</Typography>
        <div className={classes.btnsContainer}>
          {availableChains
            .filter((c) => c !== selectedChain)
            .map((chain, index) => {
              const network = config.networks[chain];
              if (!network) {
                return null;
              }
              return (
                <CommonActionButton className={classes.networkBtn} key={index} onClick={() => changeChain(chain)}>
                  {network.name}
                </CommonActionButton>
              );
            })}
        </div>
      </div>
    </div>
  );
}

export default WrongNetwork;
