import { useState } from 'react';
import { sleep } from '../../utils';
import { getWeb3Instace } from '../../utils/web3';

function useReceipt() {
  const [finished, setFinished] = useState(false);
  const onReceipt = async (confirmationBlock: number) => {
    let stopped = false;
    const web3 = getWeb3Instace();
    // infinite loop
    while (!stopped) {
      await sleep(1000);
      const latestBlock = await web3.eth.getBlockNumber();
      if (latestBlock >= confirmationBlock) {
        stopped = true;
        setFinished(true);
      }
    }
  };

  return { onReceipt, transactionFinished: finished };
}

export default useReceipt;
