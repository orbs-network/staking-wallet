import { observer } from 'mobx-react';
import { Grid, Typography } from '@material-ui/core';
import React from 'react';
import { CommonActionButton } from '../../components/base/CommonActionButton';
import { useOrbsAccountStore } from '../../store/storeHooks';
import useTheme from '@material-ui/core/styles/useTheme';

interface IProps {
  openGuardianSelectionWizard: () => void;
}

export const MyGuardianDisplay = observer<React.FC<IProps>>((props) => {
  const { openGuardianSelectionWizard } = props;
  const orbsAccountStore = useOrbsAccountStore();

  const theme = useTheme();

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
            <Typography style={{ color: theme.palette.warning.main }}>
              Note: Your ORBS tokens are delegated to an unregistered Guardian. <br />
              Only delegation to a guardian elected to the committee (top 22) is entitled to rewards.
            </Typography>
          )}
        </Grid>
      </Grid>
    );
  }
});
