import { MobXProviderContext, observer } from 'mobx-react';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useCryptoWalletIntegrationStore } from '../store/storeHooks';
import CustomSnackbar from '../components/snackbar/custom-snackbar';
import web3Service from '../services/web3Service';
import { useAlertsTranslations, useCommonsTranslations } from '../translations/translationsHooks';
import { CHAINS, ORBS_TELEGRAM } from '../constants';

const localStorageItem = 'NO_BALANCE_WARNING';

const NoBalanceWarning = observer(() => {
  const [showWarning, setShowWarning] = useState(false);
  const { mainAddress } = useCryptoWalletIntegrationStore();
  const { chainId } = useContext(MobXProviderContext);
  const alerts = useAlertsTranslations();
  const common = useCommonsTranslations();

  const close = () => {
    localStorage.setItem(localStorageItem, JSON.stringify(true));
    setShowWarning(false);
  };

  useEffect(() => {
    const onload = async () => {
      const item = localStorage.getItem(localStorageItem);
      if (item || !mainAddress) {
        return;
      }
      const balance = await web3Service.getAccountBalance(mainAddress);
      if (Number(balance) === 0) {
        setShowWarning(true);
      }
    };
    onload();
  }, [mainAddress]);

  const getMessage = useCallback(() => {
    if (chainId === CHAINS.polygon) {
      return (
        <>
          {alerts('noMaticBalance')}
          <a href={ORBS_TELEGRAM} target='_blank' rel='noopener noreferrer' style={{ marginLeft: 5 }}>
            {common('telegram')}
          </a>
        </>
      );
    }
    if (Number(chainId) === CHAINS.ethereum) {
      return <div>{alerts('noEthereumBalance')}</div>;
    }
    return null;
  }, [alerts, chainId, common]);

  return (
    <CustomSnackbar persist variant='error' hide={close} withoutAutoHide show={showWarning} message={getMessage()} />
  );
});

export default NoBalanceWarning;
