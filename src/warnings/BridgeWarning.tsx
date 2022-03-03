import { MobXProviderContext, observer } from 'mobx-react';
import React, { useContext, useEffect, useState } from 'react';
import { useOrbsAccountStore } from '../store/storeHooks';
import CustomSnackbar from '../components/snackbar/custom-snackbar';
import { sleep } from '../utils';
import { useAlertsTranslations, useCommonsTranslations } from '../translations/translationsHooks';
import { CHAINS, POLYGON_BRIDGE_URL } from '../constants';

const localStorageItem = 'BRIDGE_WARNING';

const BridgeWarning = observer(() => {
  const [showWarning, setShowWarning] = useState(false);
  const { noTokens } = useOrbsAccountStore();
  const { chainId } = useContext(MobXProviderContext);
  const alertsTranslations = useAlertsTranslations();
  const commonTranslations = useCommonsTranslations();
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
      persist
      show={showWarning && noTokens && chainId === CHAINS.polygon}
      message={
        <>
          {alertsTranslations('polygonBridgeTokens')}
          <a href={POLYGON_BRIDGE_URL} style={{ marginLeft: 5 }} target='_blank' rel='noopener noreferrer'>
            {commonTranslations('readMore')}
          </a>
        </>
      }
    />
  );
});

export default BridgeWarning;
