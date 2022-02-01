import { observer } from 'mobx-react';
import React, { useEffect, useState } from 'react';
import CustomSnackbar from '../../components/snackbar/custom-snackbar';
import { useOrbsAccountStore } from '../../store/storeHooks';
import { useAlertsTranslations } from '../../translations/translationsHooks';

const localStorageItem = 'POLYGON_CHANGE_MESSAGE';

const StakingWarning = observer(() => {
   const { hasStakedOrbs } = useOrbsAccountStore();
  const [show, setShow] = useState(false);
  const alertsTranslations = useAlertsTranslations();
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
      variant='warning'
      hide={close}
      withoutAutoHide
      show={show}
      message={alertsTranslations('swicthToPolygon')}
    />
  );
});

export default StakingWarning;
