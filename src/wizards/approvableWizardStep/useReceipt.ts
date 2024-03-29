import { useState } from 'react';
import useWeb3 from '../../hooks/useWeb3';
import web3Service from '../../services/web3Service';
import { sleep } from '../../utils';

function useReceipt() {
  const { getLatestBlock } = useWeb3();
  const [finished, setFinished] = useState(false);
  const onReceipt = async (confirmationBlock: number, callback?: () => void) => {
    let stopped = false;
    // infinite loop
    while (!stopped) {
      await sleep(1000);
      const latestBlock = await getLatestBlock();
      if (latestBlock >= confirmationBlock) {
        stopped = true;
        setFinished(true);
        if (callback) {
          callback();
        }
      }
    }
  };

  return { onReceipt, transactionFinished: finished };
}

export default useReceipt;
