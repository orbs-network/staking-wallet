import { MobXProviderContext, observer } from 'mobx-react';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useCryptoWalletIntegrationStore, useOrbsAccountStore } from '../store/storeHooks';
import CustomSnackbar from '../components/snackbar/custom-snackbar';
import { useAlertsTranslations, useCommonsTranslations } from '../translations/translationsHooks';
import { CHAINS, POLYGON_BRIDGE_URL } from '../constants';

const BridgeWarning = observer(() => {
  const [showWarning, setShowWarning] = useState(false);
  const { noTokens, doneLoading } = useOrbsAccountStore();
  const { chainId } = useContext(MobXProviderContext);
  const alertsTranslations = useAlertsTranslations();
  const commonTranslations = useCommonsTranslations();
  const { mainAddress } = useCryptoWalletIntegrationStore();
  const loadedOnce = useRef<boolean>(false);

  const localStorageItem = `BRIDGE_WARNING_${mainAddress}`;

  const close = () => {
    localStorage.setItem(localStorageItem, JSON.stringify(true));
    setShowWarning(false);
  };

  useEffect(() => {
    const onload = async () => {
      if (!loadedOnce.current) {
        return;
      }
      const item = localStorage.getItem(localStorageItem);
      if (!item && noTokens && chainId === CHAINS.polygon) {
        setShowWarning(true);
      }
    };
    if (doneLoading) {
      onload();
      loadedOnce.current = true;
    }
  }, [doneLoading, noTokens, chainId]);

  console.log(noTokens);

  return (
    <CustomSnackbar
      variant='warning'
      hide={close}
      withoutAutoHide
      persist
      show={showWarning}
      message={
        <>
          {alertsTranslations('polygonBridgeTokens')}
          {POLYGON_BRIDGE_URL && (
            <a href={POLYGON_BRIDGE_URL} style={{ marginLeft: 5 }} target='_blank' rel='noopener noreferrer'>
              {commonTranslations('readMore')}
            </a>
          )}
        </>
      }
    />
  );
});

export default BridgeWarning;
