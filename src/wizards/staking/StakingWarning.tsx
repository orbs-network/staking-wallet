import { observer } from 'mobx-react';
import React, { useEffect, useState } from 'react';
import CustomSnackbar from '../../components/snackbar/custom-snackbar';
import { useCryptoWalletIntegrationStore, useOrbsAccountStore } from '../../store/storeHooks';
import { useAlertsTranslations } from '../../translations/translationsHooks';


const StakingWarning = observer(() => {
   const { hasStakedOrbs } = useOrbsAccountStore();
  const [show, setShow] = useState(false);
  const alertsTranslations = useAlertsTranslations();
  const { mainAddress } = useCryptoWalletIntegrationStore();

  const localStorageItem = `POLYGON_CHANGE_MESSAGE_${mainAddress}`;
  const close = () => {
    localStorage.setItem(localStorageItem, JSON.stringify(true));
    setShow(false);
  };

  useEffect(() => {
    const seen = localStorage.getItem(localStorageItem);
    if (!seen && !hasStakedOrbs) {
      setShow(true);
    }
  }, [hasStakedOrbs]);

  return (
    <CustomSnackbar
      variant='info'
      hide={close}
      withoutAutoHide
      show={show}
      message={alertsTranslations('swicthToPolygon')}
    />
  );
});

export default StakingWarning;
