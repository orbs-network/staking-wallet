import React, { useMemo, useCallback, useState } from 'react';
import { useOrbsAccountStore, useReReadAllStoresData } from '../../store/storeHooks';
import { ITransactionCreationStepProps } from '../approvableWizardStep/ApprovableWizardStep';
import { observer } from 'mobx-react';
import { fullOrbsFromWeiOrbs, fullOrbsFromWeiOrbsString, weiOrbsFromFullOrbs } from '../../cryptoUtils/unitConverter';
import { BaseStepContent, IActionButtonProps } from '../approvableWizardStep/BaseStepContent';
import { useUnstakingWizardTranslations, useWizardsCommonTranslations } from '../../translations/translationsHooks';
import { Typography } from '@material-ui/core';
import { useTxCreationErrorHandlingEffect, useWizardState } from '../wizardHooks';
import { useAnalyticsService } from '../../services/ServicesHooks';
import stakingUtil from '../../utils/stakingUtil';
import StakingInput from '../components/staking-input';
import handleApprove from '../helpers/handle-approve';
import { hanleUnstakingError } from '../helpers/error-handling';
import { STAKING_ACTIONS } from '../../services/analytics/analyticConstants';
export const OrbsUntakingStepContent = observer((props: ITransactionCreationStepProps) => {
  const { disableInputs, onPromiEventAction, txError, closeWizard } = props;

  const wizardsCommonTranslations = useWizardsCommonTranslations();
  const unstakingWizardTranslations = useUnstakingWizardTranslations();
  const orbsAccountStore = useOrbsAccountStore();
  const analyticsService = useAnalyticsService();

  const stakedOrbsNumericalFormat = fullOrbsFromWeiOrbs(orbsAccountStore.stakedOrbs);

  const stakedOrbsStringFormat = fullOrbsFromWeiOrbsString(orbsAccountStore.stakedOrbs);
  const [orbsForUnstaking, setOrbsForUnstaking] = useState<string>(stakedOrbsStringFormat);

  const { message, subMessage, isBroadcastingMessage } = useWizardState(
    unstakingWizardTranslations('unstakingSubStep_message_selectAmountOfOrbs'),
    unstakingWizardTranslations('unstakingSubStep_subMessage_pressUnstakeAndApprove'),
    false,
  );
  // Handle error by displaying the proper error message
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useTxCreationErrorHandlingEffect(message, subMessage, isBroadcastingMessage, txError);

  const isApproveEnabled = stakingUtil.isApproveEnabled(stakedOrbsStringFormat, orbsForUnstaking);

  const unstake = useCallback(() => {
    handleApprove({
      isApproveEnabled,
      message,
      subMessage,
      promiEvent: orbsAccountStore.unstakeTokens(weiOrbsFromFullOrbs(orbsForUnstaking)),
      isBroadcastingMessage,
      onPromiEventAction,
      wizardsCommonTranslations,
      errorHandler: hanleUnstakingError,
      warnMsg: `tried to un-stake out of range amount of ${orbsForUnstaking}`,
      analyticsHandler: analyticsService.trackStakingContractInteractionSuccess(
        STAKING_ACTIONS.unstaking,
        stakedOrbsNumericalFormat,
      ),
    });
  }, [
    analyticsService,
    isApproveEnabled,
    isBroadcastingMessage,
    message,
    onPromiEventAction,
    orbsAccountStore,
    orbsForUnstaking,
    stakedOrbsNumericalFormat,
    subMessage,
    wizardsCommonTranslations,
  ]);

  const actionButtonProps = useMemo<IActionButtonProps>(
    () => ({
      onClick: () => unstake(),
      title: unstakingWizardTranslations('unstakingSubStep_action_unstake'),
      isDisabled: !isApproveEnabled,
    }),
    [isApproveEnabled, unstake, unstakingWizardTranslations],
  );

  const unstakingInput = (
    <StakingInput
      id='orbsUnstaking'
      placeholder={wizardsCommonTranslations('popup_input_placeholder')}
      value={orbsForUnstaking}
      onChange={setOrbsForUnstaking}
      disabled={disableInputs}
      showMaxBtn={stakingUtil.isMaxBtnEnabled(orbsForUnstaking, stakedOrbsStringFormat, disableInputs)}
      handleMax={() => setOrbsForUnstaking(stakedOrbsStringFormat)}
      maxText={wizardsCommonTranslations('popup_max')}
    >
      {orbsAccountStore.hasOrbsInCooldown ? (
        <>
          <Typography style={{ color: 'orange', textAlign: 'center' }}>
            {unstakingWizardTranslations('unstakingSubStep_warning_thereAreOrbsInCooldownHeader')}
          </Typography>
          <Typography style={{ color: 'orange', textAlign: 'center' }}>
            {unstakingWizardTranslations('unstakingSubStep_warning_thereAreOrbsInCooldownBody')}
          </Typography>
        </>
      ) : null}
    </StakingInput>
  );

  // TODO : O.L : Use proper grid system instead of the 'br's
  return (
    <BaseStepContent
      message={message.value}
      subMessage={subMessage.value}
      title={unstakingWizardTranslations('unstakingSubStep_stepTitle')}
      infoTitle={unstakingWizardTranslations('unstakingSubStep_stepExplanation')}
      disableInputs={disableInputs}
      isLoading={isBroadcastingMessage.value}
      contentTestId={'wizard_sub_step_initiate_unstaking_tx'}
      actionButtonProps={actionButtonProps}
      innerContent={unstakingInput}
      onCancelButtonClicked={closeWizard}
      close={closeWizard}
      cancelButtonText={wizardsCommonTranslations('action_close')}
    />
  );
});
