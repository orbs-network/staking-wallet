import { observer } from 'mobx-react';
import { Grid, Typography } from '@material-ui/core';
import React from 'react';
import { CommonActionButton } from '../../components/base/CommonActionButton';
import { useOrbsAccountStore } from '../../store/storeHooks';

interface IProps {
  openGuardianSelectionWizard: () => void;
}

export const MyGuardianDisplay = observer<React.FC<IProps>>((props) => {
  const { openGuardianSelectionWizard } = props;
  const orbsAccountStore = useOrbsAccountStore();

  if (!orbsAccountStore.hasSelectedGuardian) {
    return (
      <Grid item xs={12} container spacing={1} direction={'column'} alignItems={'center'} justify={'center'}>
        <Grid item xs={12} md={6}>
          <Typography color={'error'}>
            Warning - You have no selected Guardian. No rewards will be accumulated
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <CommonActionButton onClick={openGuardianSelectionWizard}>Select a guardian</CommonActionButton>
        </Grid>
      </Grid>
    );
  } else {
    return (
      <Grid item xs={12} container direction={'column'} spacing={1}>
        <Grid item>
          <Typography>Your selected guardian is {orbsAccountStore.selectedGuardianAddress}</Typography>
        </Grid>
      </Grid>
    );
  }
});
