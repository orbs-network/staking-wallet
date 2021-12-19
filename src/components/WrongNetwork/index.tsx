import { Typography } from '@material-ui/core';
import React from 'react';
import LinkOffIcon from '@material-ui/icons/LinkOff';
import { makeStyles } from '@material-ui/styles';
import { NETWORK_QUERY_PARAM } from '../../constants';
import { useHistory, useLocation } from 'react-router';
import { removeQueryParam } from '../../utils/url';
import { triggerNetworkChange } from '../../utils/web3';
import config, { INetwork } from '../../config';
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
  btnsContainer: {
    marginTop: 30,
    display: 'flex',
  },
  networkBtn: {
    marginRight: 20,
    '&:last-child': {
      marginRight: 0,
    },
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
  availableChains?: number[];
  selectedChain: number;
}

function WrongNetwork({ availableChains =[], selectedChain }: IProps) {
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();

  const onSubmit = (id: number, network: INetwork) => {
    const { nativeCurrency, rpcUrls, blockExplorerUrls, name: chainName } = network;
    const onNetworkChanged = () => {
      removeQueryParam(NETWORK_QUERY_PARAM, history, location.search);
    };

    triggerNetworkChange(id, { chainName, nativeCurrency, rpcUrls, blockExplorerUrls }, onNetworkChanged);
  };

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
            .map((availableChain, index) => {
              const network = config.networks[availableChain];
              if (!network) {
                return null;
              }
              return (
                <CommonActionButton
                  className={classes.networkBtn}
                  key={index}
                  onClick={() => onSubmit(availableChain, network)}
                >
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
