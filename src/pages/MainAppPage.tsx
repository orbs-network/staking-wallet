import React from 'react';
import { Grid } from '@material-ui/core';
import { GuardiansSection } from '../sections/guardians/GuardiansSection';
import { WalletSectionsWrapper } from '../sections/WalletSectionsWrapper';
import useAnalytics from '../hooks/useAnalytics';
import { events } from '../services/analytics/constants';
import { version } from '../../package.json';
import BridgeWarning from '../warnings/BridgeWarning';
import NoBalanceWarning from '../warnings/NoBalanceWarning';

export const MainAppPage = () => {
  // DEV_NOTE : id the user is connected than we consider this as a 'log in' for analytics purposes
  useAnalytics(events.trackAppLogin);

  return (
    <Grid container item direction={'column'} id={'mainPage'}>
      <WalletSectionsWrapper />
      <GuardiansSection />
      <BridgeWarning />
      <NoBalanceWarning />
      <div style={{ fontSize: 8, textAlign: 'center' }}>{version}</div>
    </Grid>
  );
};
