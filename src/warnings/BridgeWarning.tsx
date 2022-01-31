import { MobXProviderContext, observer } from 'mobx-react';
import React, { useContext, useEffect, useState } from 'react';
import { useOrbsAccountStore } from '../store/storeHooks';
import CustomSnackbar from '../components/snackbar/custom-snackbar';
import { sleep } from '../utils';

const localStorageItem = 'BRIDGE_WARNING';

const BridgeWarning = observer(() => {
  const [showWarning, setShowWarning] = useState(false);
  const { noTokens } = useOrbsAccountStore();
  const { chainId } = useContext(MobXProviderContext);
  const close = () => {
    localStorage.setItem(localStorageItem, JSON.stringify(true));
    setShowWarning(false);
  };

  useEffect(() => {
    const onload = async () => {
      await sleep(3000);
      const item = localStorage.getItem(localStorageItem);
      if (!item) {
        setShowWarning(true);
      }
    };
    onload();
  }, []);

  return (
    <CustomSnackbar
      variant='warning'
      hide={close}
      withoutAutoHide
      show={showWarning && noTokens && chainId === 137}
      message={
        <>
          Did you move your ORBS tokens on Polygon bridge from Ethereum? Read more
          <a href='' style={{ marginLeft: 5 }}>
            Link
          </a>
        </>
      }
    />
  );
});

export default BridgeWarning;
