import { observer } from 'mobx-react';
import { Grid, Typography } from '@material-ui/core';
import React from 'react';
import { CommonActionButton } from '../../components/base/CommonActionButton';
import { useOrbsAccountStore } from '../../store/storeHooks';
import useTheme from '@material-ui/core/styles/useTheme';
import { useGuardiansSectionTranslations } from '../../translations/translationsHooks';

interface IProps {
  openGuardianSelectionWizard: () => void;
}

export const MyGuardianDisplay = observer<React.FC<IProps>>((props) => {
  const { openGuardianSelectionWizard } = props;
  const orbsAccountStore = useOrbsAccountStore();
  const guardiansSectionTranslations = useGuardiansSectionTranslations();

  const theme = useTheme();

  if (!orbsAccountStore.hasSelectedGuardian) {
    return (
      <Grid item xs={12} container spacing={1} direction={'column'} alignItems={'center'} justify={'center'}>
        <Grid item xs={12} md={6}>
          <Typography color={'error'}>
            {guardiansSectionTranslations('myGuardianDisplay_error_noSelectedGuardianOrSelfDelegatingWhileNotGuardian')}
          </Typography>
          <Typography color={'error'}>
            {guardiansSectionTranslations('myGuardianDisplay_info_onlyDelegationToCommitteeMembersEntitlesRewards')}
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <CommonActionButton onClick={openGuardianSelectionWizard}>
            {guardiansSectionTranslations('myGuardianDisplay_action_selectAGuardian')}
          </CommonActionButton>
        </Grid>
      </Grid>
    );
  } else {
    const selectedGuardian = orbsAccountStore.selectedGuardian;
    const delegationMessage = orbsAccountStore.isGuardian
      ? `${guardiansSectionTranslations('myGuardianDisplay_action_youAre', { name: selectedGuardian.Name })}`
      : orbsAccountStore.isSelectedGuardianRegistered
      ? `${guardiansSectionTranslations('myGuardianDisplay_text_selectedGuardianIs', {
          guardianName: selectedGuardian.Name,
        })}`
      : `${guardiansSectionTranslations('myGuardianDisplay_text_selectedGuardianAddressIs', {
          guardianAddress: orbsAccountStore.selectedGuardianAddress,
        })} (${guardiansSectionTranslations('myGuardianDisplay_text_unregistered')})`;

    return (
      <Grid item xs={12} container direction={'column'} spacing={1}>
        <Grid item>
          <Typography>{delegationMessage}</Typography>
          {!orbsAccountStore.isSelectedGuardianRegistered && (
            <Typography style={{ color: theme.palette.warning.main }}>
              {guardiansSectionTranslations('myGuardianDisplay_warning_delegatedToAnUnregisteredGuardian')}
              <br />
              {guardiansSectionTranslations('myGuardianDisplay_warning_onlyCommitteeDelegationEntitlesRewards')}
            </Typography>
          )}
        </Grid>
      </Grid>
    );
  }
});
