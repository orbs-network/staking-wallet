import React, { useEffect } from 'react';
import Web3 from 'web3';
import config from '../../config';
import { PromiEvent } from 'web3-core';
import { useOrbsAccountStore } from '../../store/storeHooks';
import { observable } from 'mobx';
import { observer } from 'mobx-react';

const createWeb3Instance = () => {
  const ethereumProvider = (window as any).ethereum;
  let web3;
  if (ethereumProvider) {
    web3 = new Web3(ethereumProvider as any);
  } else {
    web3 = new Web3(new Web3.providers.WebsocketProvider(config.ETHEREUM_PROVIDER_WS));
  }
  return web3;
};

const TransactionHandler = observer(() => {
  useEffect(() => {
    la();
  }, []);

  const la = async () => {
    const transactionHash = localStorage.getItem('hash');
    if (!transactionHash) return;
    const web3 = createWeb3Instance();
    // web3.eth.getTransaction(transactionHash, (err, res) => {
    //   console.log({ res });
    // });
  };

  return <div></div>;
});

export default TransactionHandler;
