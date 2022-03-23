import React, { useCallback, useEffect, useMemo } from 'react';
import { observer } from 'mobx-react';
import { useOrbsAccountStore, useReReadAllStoresData } from '../../store/storeHooks';
import { ITransactionCreationStepProps } from '../approvableWizardStep/ApprovableWizardStep';
import { fullOrbsFromWeiOrbs, fullOrbsFromWeiOrbsString } from '../../cryptoUtils/unitConverter';
import { BaseStepContent, IActionButtonProps } from '../approvableWizardStep/BaseStepContent';
import { useWithdrawingWizardTranslations, useWizardsCommonTranslations } from '../../translations/translationsHooks';
import { useTxCreationErrorHandlingEffect, useWizardState } from '../wizardHooks';
import { STAKING_ACTIONS } from '../../services/analytics/analyticConstants';
import { useAnalyticsService } from '../../services/ServicesHooks';
import { handleWithdrawingError } from '../helpers/error-handling';
import handleApprove from '../helpers/handle-approve';
import { formatStringAsNumber } from '../../utils/stringUtils';
export const OrbsWithdrawingStepContent = observer((props: ITransactionCreationStepProps) => {
  const { disableInputs, onPromiEventAction, txError, closeWizard } = props;

  const wizardsCommonTranslations = useWizardsCommonTranslations();
  const withdrawingWizardTranslations = useWithdrawingWizardTranslations();
  const orbsAccountStore = useOrbsAccountStore();
  const analyticsService = useAnalyticsService();


  // Start and limit by allowance
  const fullOrbsReadyForWithdrawal = fullOrbsFromWeiOrbs(orbsAccountStore.orbsInCoolDown);
  const fullOrbsReadyForWithdrawalString = fullOrbsFromWeiOrbsString(orbsAccountStore.orbsInCoolDown);

  const { message, subMessage, isBroadcastingMessage } = useWizardState(
    '',
    withdrawingWizardTranslations('withdrawingSubStep_subMessage_pressWithdrawAndApprove'),
    false,
  );

  // Handle error by displaying the proper error message
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useTxCreationErrorHandlingEffect(message, subMessage, isBroadcastingMessage, txError);

  const withdrawTokens = useCallback(
    () =>
      handleApprove({
        message,
        subMessage,
        promiEvent: orbsAccountStore.withdrawTokens(),
        isBroadcastingMessage,
        onPromiEventAction,
        wizardsCommonTranslations,
        errorHandler: handleWithdrawingError,
        analyticsHandler: analyticsService.trackStakingContractInteractionSuccess(
          STAKING_ACTIONS.withdrawing,
          fullOrbsReadyForWithdrawal,
        ),
      }),
    [
      isBroadcastingMessage,
      message,
      onPromiEventAction,
      orbsAccountStore,
      subMessage,
      wizardsCommonTranslations,
      analyticsService,
      fullOrbsReadyForWithdrawal,
    ],
  );

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
        orbsForWithdrawal: formatStringAsNumber(fullOrbsReadyForWithdrawalString, true),
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
