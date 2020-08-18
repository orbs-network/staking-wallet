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

  // TODO : ORL : TRANSLATION

  if (!orbsAccountStore.hasSelectedGuardian) {
    return (
      <Grid item xs={12} container spacing={1} direction={'column'} alignItems={'center'} justify={'center'}>
        <Grid item xs={12} md={6}>
          <Typography color={'error'}>
            No selected guardian / Self delegating (Your address is not registered as a Guardian)
          </Typography>
          <Typography color={'error'}>Note : Only delegation to committee members entitles rewards.</Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <CommonActionButton onClick={openGuardianSelectionWizard}>Select a guardian</CommonActionButton>
        </Grid>
      </Grid>
    );
  } else {
    const selectedGuardian = orbsAccountStore.selectedGuardian;
    const delegationMessage = orbsAccountStore.isGuardian
      ? `You are a ${selectedGuardian.Name}`
      : orbsAccountStore.isSelectedGuardianRegistered
      ? `Selected guardian is ${selectedGuardian.Name}`
      : `Selected guardian: ${orbsAccountStore.selectedGuardianAddress} (Unregistered)`;

    return (
      <Grid item xs={12} container direction={'column'} spacing={1}>
        <Grid item>
          <Typography>{delegationMessage}</Typography>
          {!orbsAccountStore.isSelectedGuardianRegistered && (
            <Typography color={'error'}>
              Note: delegated to an unregistered Guardian. Only delegation to committee members entitles rewards.
            </Typography>
          )}
        </Grid>
      </Grid>
    );
  }
});
