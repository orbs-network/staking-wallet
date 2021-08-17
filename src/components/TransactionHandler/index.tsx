import React, { useEffect } from 'react';
import Web3 from 'web3';
import config from '../../config';

function TransactionHandler() {
  const test = async () => {
    try {
      const ethereumProvider = (window as any).ethereum;
      let web3;
      if (ethereumProvider) {
        web3 = new Web3(ethereumProvider as any);
      } else {
        web3 = new Web3(new Web3.providers.WebsocketProvider(config.ETHEREUM_PROVIDER_WS));
      }

      const accounts = await web3.eth.getAccounts();
      const account = accounts[0];
      console.log({ account });
      if (!account) {
        return;
      }
      const block = await web3.eth.getBlock('latest');
    } catch (error) {
      console.error('error in getting chainId');
    }
  };

  const test1 = async () => {
    const ethereumProvider = (window as any).ethereum;
    let web3;
    if (ethereumProvider) {
      web3 = new Web3(ethereumProvider as any);
    } else {
      web3 = new Web3(new Web3.providers.WebsocketProvider(config.ETHEREUM_PROVIDER_WS));
    }

    const hash = localStorage.getItem('hash');
    web3.eth.getTransactionReceipt(hash, function (err, receipt) {
      if (!err) {
        // Send notification to the user receipt
        console.log({ receipt });
        // Remove from the pending transactions
        localStorage.setItem('hash', null);
      }
    });
  };

  useEffect(() => {
    test1();
  }, []);
  return <div></div>;
}

export default TransactionHandler;
