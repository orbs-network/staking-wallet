import React, { useCallback, useEffect, useMemo } from 'react';
import { useBoolean, useNumber, useStateful } from 'react-hanger';
import { useOrbsAccountStore, useReReadAllStoresData } from '../../store/storeHooks';
import { ITransactionCreationStepProps } from '../approvableWizardStep/ApprovableWizardStep';
import { observer } from 'mobx-react';
import { fullOrbsFromWeiOrbs, weiOrbsFromFullOrbs } from '../../cryptoUtils/unitConverter';
import { messageFromTxCreationSubStepError } from '../wizardMessages';
import { BaseStepContent, IActionButtonProps } from '../approvableWizardStep/BaseStepContent';
import { useUnstakingWizardTranslations, useWizardsCommonTranslations } from '../../translations/translationsHooks';
import { FullWidthOrbsInputField } from '../../components/inputs/FullWidthOrbsInputField';
import { Button, Typography } from '@material-ui/core';
import { useTxCreationErrorHandlingEffect, useWizardState } from '../wizardHooks';
import { STAKING_ACTIONS } from '../../services/analytics/analyticConstants';
import { useAnalyticsService } from '../../services/ServicesHooks';
import { CommonActionButton } from '../../components/base/CommonActionButton';
import { CSSProperties } from '@material-ui/core/styles/withStyles';

const maxBtnStyle: CSSProperties = {
  position: 'absolute',
  right: '10px',
  height: '35px',
  bottom: '20px',
};
const inputStyle = {
  marginTop: '20px',
};

export const OrbsUntakingStepContent = observer((props: ITransactionCreationStepProps) => {
  const { disableInputs, onPromiEventAction, txError, closeWizard } = props;

  const wizardsCommonTranslations = useWizardsCommonTranslations();
  const unstakingWizardTranslations = useUnstakingWizardTranslations();
  const orbsAccountStore = useOrbsAccountStore();
  const analyticsService = useAnalyticsService();

  const reReadStoresData = useReReadAllStoresData();

  // Start and limit by allowance
  const stakedOrbsNumericalFormat = fullOrbsFromWeiOrbs(orbsAccountStore.stakedOrbs);
  const orbsForUnstaking = useNumber(0, {
    lowerLimit: 0,
    upperLimit: stakedOrbsNumericalFormat,
  });
  const { message, subMessage, isBroadcastingMessage } = useWizardState(
    unstakingWizardTranslations('unstakingSubStep_message_selectAmountOfOrbs'),
    unstakingWizardTranslations('unstakingSubStep_subMessage_pressUnstakeAndApprove'),
    false,
  );
  // Handle error by displaying the proper error message
  useTxCreationErrorHandlingEffect(message, subMessage, isBroadcastingMessage, txError);

  const unstakeTokens = useCallback(() => {
    // TODO : FUTURE : O.L : Add written error message about out of range
    if (orbsForUnstaking.value < 1 || orbsForUnstaking.value > stakedOrbsNumericalFormat) {
      console.warn(`tried to un-stake out of range amount of ${orbsForUnstaking.value}`);
      return;
    }

    message.setValue('');
    subMessage.setValue(wizardsCommonTranslations('subMessage_pleaseApproveTransactionWithExplanation'));

    const promiEvent = orbsAccountStore.unstakeTokens(weiOrbsFromFullOrbs(orbsForUnstaking.value));

    // DEV_NOTE : If we have txHash, it means the user click on 'confirm' and generated one.
    promiEvent.on('transactionHash', (txHash) => {
      subMessage.setValue(wizardsCommonTranslations('subMessage_broadcastingYourTransactionDoNotRefreshOrCloseTab'));
      isBroadcastingMessage.setTrue();
    });

    onPromiEventAction(promiEvent, () => {
      analyticsService.trackStakingContractInteractionSuccess(STAKING_ACTIONS.unstaking, orbsForUnstaking.value);
      reReadStoresData();
    });
  }, [
    orbsForUnstaking.value,
    stakedOrbsNumericalFormat,
    message,
    subMessage,
    wizardsCommonTranslations,
    orbsAccountStore,
    onPromiEventAction,
    isBroadcastingMessage,
    analyticsService,
  ]);

  const actionButtonProps = useMemo<IActionButtonProps>(
    () => ({
      onClick: unstakeTokens,
      title: unstakingWizardTranslations('unstakingSubStep_action_unstake'),
      isDisabled:
        !orbsForUnstaking.value || orbsForUnstaking.value === 0 || orbsForUnstaking.value > stakedOrbsNumericalFormat,
    }),
    [orbsForUnstaking.value, stakedOrbsNumericalFormat, unstakeTokens, unstakingWizardTranslations],
  );

  const handleMax = useCallback(() => {
    orbsForUnstaking.setValue(stakedOrbsNumericalFormat);
  }, []);

  const unstakingInput = useMemo(() => {
    const showMaxBtn = orbsForUnstaking.value + 1 <= stakedOrbsNumericalFormat;
    const orbsInCooldownWarning = orbsAccountStore.hasOrbsInCooldown ? (
      <>
        <Typography style={{ color: 'orange', textAlign: 'center' }}>
          {unstakingWizardTranslations('unstakingSubStep_warning_thereAreOrbsInCooldownHeader')}{' '}
        </Typography>
        <Typography style={{ color: 'orange', textAlign: 'center' }}>
          {unstakingWizardTranslations('unstakingSubStep_warning_thereAreOrbsInCooldownBody')}{' '}
        </Typography>
      </>
    ) : null;

    return (
      <>
        {orbsInCooldownWarning}
        <FullWidthOrbsInputField
          id={'orbsUnstaking'}
          value={orbsForUnstaking.value}
          onChange={(value) => orbsForUnstaking.setValue(value || 0)}
          disabled={disableInputs}
          placeholder={unstakingWizardTranslations('unstakingSubStep_input_placeholder')}
          customStyle={inputStyle}
        />
        {showMaxBtn && (
          <CommonActionButton style={maxBtnStyle} onClick={handleMax}>
            {unstakingWizardTranslations('unstakingSubStep_max')}
          </CommonActionButton>
        )}
      </>
    );
  }, [
    handleMax,
    orbsAccountStore.hasOrbsInCooldown,
    unstakingWizardTranslations,
    orbsForUnstaking,
    disableInputs,
    stakedOrbsNumericalFormat,
  ]);

  // TODO : ORL : TRANSLATIONS
  const infoTitleToTranslate =
    "This will take your ORBS out of their staked state and start a 14-day cooldown period, after which you'll be able to withdraw them to your wallet. During those 14 days, you may choose to re-stake your tokens.";

  // TODO : O.L : Use proper grid system instead of the 'br's
  return (
    <BaseStepContent
      message={message.value}
      subMessage={subMessage.value}
      title={unstakingWizardTranslations('unstakingSubStep_stepTitle')}
      // infoTitle={unstakingWizardTranslations('unstakingSubStep_stepExplanation')}
      infoTitle={infoTitleToTranslate}
      disableInputs={disableInputs}
      isLoading={isBroadcastingMessage.value}
      contentTestId={'wizard_sub_step_initiate_unstaking_tx'}
      actionButtonProps={actionButtonProps}
      innerContent={unstakingInput}
      addCancelButton
      onCancelButtonClicked={closeWizard}
      cancelButtonText={wizardsCommonTranslations('action_close')}
    />
  );
});
