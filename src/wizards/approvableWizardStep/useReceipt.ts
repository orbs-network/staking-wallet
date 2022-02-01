import { useState } from 'react';
import web3Service from '../../services/web3Service';
import { sleep } from '../../utils';

function useReceipt() {
  const [finished, setFinished] = useState(false);
  const onReceipt = async (confirmationBlock: number) => {
    let stopped = false;
    // infinite loop
    while (!stopped) {
      await sleep(1000);
      const latestBlock = await web3Service.getLatestBlock();
      if (latestBlock >= confirmationBlock) {
        stopped = true;
        setFinished(true);
      }
    }
  };

  return { onReceipt, transactionFinished: finished };
}

export default useReceipt;
