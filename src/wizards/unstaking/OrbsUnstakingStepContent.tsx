import React, { useCallback, useMemo, useState } from 'react';
import { useOrbsAccountStore, useReReadAllStoresData } from '../../store/storeHooks';
import { ITransactionCreationStepProps } from '../approvableWizardStep/ApprovableWizardStep';
import { observer } from 'mobx-react';
import { fullOrbsFromWeiOrbs, fullOrbsFromWeiOrbsString, weiOrbsFromFullOrbs } from '../../cryptoUtils/unitConverter';
import { BaseStepContent, IActionButtonProps } from '../approvableWizardStep/BaseStepContent';
import { useUnstakingWizardTranslations, useWizardsCommonTranslations } from '../../translations/translationsHooks';
import { FullWidthOrbsInputField } from '../../components/inputs/FullWidthOrbsInputField';
import { Button, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useTxCreationErrorHandlingEffect, useWizardState } from '../wizardHooks';
import { STAKING_ACTIONS } from '../../services/analytics/analyticConstants';
import { useAnalyticsService } from '../../services/ServicesHooks';
import { MaxButton } from '../../components/base/maxButton';
import stakingUtil from '../../utils/stakingUtil';

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
  const stakedOrbsNumericalFormat = fullOrbsFromWeiOrbs(orbsAccountStore.stakedOrbs);

  const stakedOrbsStringFormat = fullOrbsFromWeiOrbsString(orbsAccountStore.stakedOrbs);
  const [orbsForUnstaking, setOrbsForUnstaking] = useState<string>(stakedOrbsStringFormat);

  const { message, subMessage, isBroadcastingMessage } = useWizardState(
    unstakingWizardTranslations('unstakingSubStep_message_selectAmountOfOrbs'),
    unstakingWizardTranslations('unstakingSubStep_subMessage_pressUnstakeAndApprove'),
    false,
  );
  // Handle error by displaying the proper error message
  useTxCreationErrorHandlingEffect(message, subMessage, isBroadcastingMessage, txError);

  const unstakeTokens = useCallback(() => {
    // TODO : FUTURE : O.L : Add written error message about out of range
    if (!stakingUtil.isApproveEnabled(stakedOrbsStringFormat, orbsForUnstaking)) {
      console.warn(`tried to un-stake out of range amount of ${orbsForUnstaking}`);
      return;
    }

    message.setValue('');
    subMessage.setValue(wizardsCommonTranslations('subMessage_pleaseApproveTransactionWithExplanation'));

    const promiEvent = orbsAccountStore.unstakeTokens(weiOrbsFromFullOrbs(orbsForUnstaking));

    // DEV_NOTE : If we have txHash, it means the user click on 'confirm' and generated one.
    promiEvent.on('transactionHash', (txHash) => {
      subMessage.setValue(wizardsCommonTranslations('subMessage_broadcastingYourTransactionDoNotRefreshOrCloseTab'));
      isBroadcastingMessage.setTrue();
    });

    onPromiEventAction(promiEvent, () => {
      analyticsService.trackStakingContractInteractionSuccess(STAKING_ACTIONS.unstaking, stakedOrbsNumericalFormat);
      reReadStoresData();
    });
  }, [
    orbsForUnstaking,
    stakedOrbsStringFormat,
    stakedOrbsNumericalFormat,
    reReadStoresData,
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
      isDisabled: !stakingUtil.isApproveEnabled(stakedOrbsStringFormat, orbsForUnstaking),
    }),
    [orbsForUnstaking, stakedOrbsStringFormat, unstakeTokens, unstakingWizardTranslations],
  );

  const handleMax = useCallback(() => {
    setOrbsForUnstaking(stakedOrbsStringFormat);
  }, [stakedOrbsStringFormat]);

  const unstakingInput = useMemo(() => {
    const showMaxBtn = stakingUtil.isMaxBtnEnabled(orbsForUnstaking, stakedOrbsStringFormat, disableInputs);
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

    const maxBtn = (
      <MaxButton disabled={!showMaxBtn} onClick={handleMax}>
        {wizardsCommonTranslations('popup_max')}
      </MaxButton>
    );

    return (
      <>
        {orbsInCooldownWarning}
        <FullWidthOrbsInputField
          id={'orbsUnstaking'}
          value={orbsForUnstaking}
          onChange={(value) => setOrbsForUnstaking(value)}
          disabled={disableInputs}
          placeholder={wizardsCommonTranslations('popup_input_placeholder')}
          customStyle={inputStyle}
          buttonComponent={maxBtn}
        />
      </>
    );
  }, [
    handleMax,
    orbsAccountStore.hasOrbsInCooldown,
    unstakingWizardTranslations,
    orbsForUnstaking,
    disableInputs,
    stakedOrbsStringFormat,
    wizardsCommonTranslations,
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
      onCancelButtonClicked={closeWizard}
      close={closeWizard}
      cancelButtonText={wizardsCommonTranslations('action_close')}
    />
  );
});
