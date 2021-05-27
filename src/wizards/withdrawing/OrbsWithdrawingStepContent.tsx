import React, { useCallback, useEffect, useMemo } from 'react';
import { observer } from 'mobx-react';
import { useStateful } from 'react-hanger';
import { useOrbsAccountStore, useReReadAllStoresData } from '../../store/storeHooks';
import { ITransactionCreationStepProps } from '../approvableWizardStep/ApprovableWizardStep';
import { messageFromTxCreationSubStepError } from '../wizardMessages';
import { fullOrbsFromWeiOrbs } from '../../cryptoUtils/unitConverter';
import { BaseStepContent, IActionButtonProps } from '../approvableWizardStep/BaseStepContent';
import { useWithdrawingWizardTranslations, useWizardsCommonTranslations } from '../../translations/translationsHooks';
import { useTxCreationErrorHandlingEffect, useWizardState } from '../wizardHooks';
import { STAKING_ACTIONS } from '../../services/analytics/analyticConstants';
import { useAnalyticsService } from '../../services/ServicesHooks';
import { NumberToDisplayFormat } from '../../utils/numberUtils';
import constants from '../../constants/constants';

export const OrbsWithdrawingStepContent = observer((props: ITransactionCreationStepProps) => {
  const { disableInputs, onPromiEventAction, txError, closeWizard } = props;

  const wizardsCommonTranslations = useWizardsCommonTranslations();
  const withdrawingWizardTranslations = useWithdrawingWizardTranslations();
  const orbsAccountStore = useOrbsAccountStore();
  const analyticsService = useAnalyticsService();

  const reReadStoresData = useReReadAllStoresData();

  // Start and limit by allowance
  const fullOrbsReadyForWithdrawal = fullOrbsFromWeiOrbs(orbsAccountStore.orbsInCoolDown);
  const { message, subMessage, isBroadcastingMessage } = useWizardState(
    '',
    withdrawingWizardTranslations('withdrawingSubStep_subMessage_pressWithdrawAndApprove'),
    false,
  );

  // Handle error by displaying the proper error message
  useTxCreationErrorHandlingEffect(message, subMessage, isBroadcastingMessage, txError);

  const withdrawTokens = useCallback(() => {
    message.setValue('');
    subMessage.setValue(wizardsCommonTranslations('subMessage_pleaseApproveTransactionWithExplanation'));

    const promiEvent = orbsAccountStore.withdrawTokens();

    // DEV_NOTE : If we have txHash, it means the user click on 'confirm' and generated one.
    promiEvent.on('transactionHash', (txHash) => {
      subMessage.setValue(wizardsCommonTranslations('subMessage_broadcastingYourTransactionDoNotRefreshOrCloseTab'));
      isBroadcastingMessage.setTrue();
    });

    onPromiEventAction(promiEvent, () => {
      analyticsService.trackStakingContractInteractionSuccess(STAKING_ACTIONS.withdrawing, fullOrbsReadyForWithdrawal);
      reReadStoresData();
    });
  }, [
    message,
    subMessage,
    wizardsCommonTranslations,
    orbsAccountStore,
    onPromiEventAction,
    isBroadcastingMessage,
    analyticsService,
    fullOrbsReadyForWithdrawal,
    reReadStoresData,
  ]);

  const actionButtonProps = useMemo<IActionButtonProps>(
    () => ({
      onClick: withdrawTokens,
      title: withdrawingWizardTranslations('withdrawingSubStep_action_withdraw'),
    }),
    [withdrawTokens, withdrawingWizardTranslations],
  );

  return (
    <BaseStepContent
      message={message.value}
      subMessage={subMessage.value}
      title={withdrawingWizardTranslations('withdrawingSubStep_stepTitle', {
        orbsForWithdrawal: NumberToDisplayFormat(fullOrbsReadyForWithdrawal, constants.numbersDecimalToInsertLimit, 3),
      })}
      infoTitle={withdrawingWizardTranslations('withdrawingSubStep_stepExplanation')}
      disableInputs={disableInputs}
      isLoading={isBroadcastingMessage.value}
      contentTestId={'wizard_sub_step_initiate_withdrawing_tx'}
      actionButtonProps={actionButtonProps}
      addCancelButton
      close={closeWizard}
      onCancelButtonClicked={closeWizard}
      cancelButtonText={wizardsCommonTranslations('action_close')}
    />
  );
});
