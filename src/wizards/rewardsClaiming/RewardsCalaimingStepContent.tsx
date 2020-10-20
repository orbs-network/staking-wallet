import React, { useCallback, useMemo } from 'react';
import { useOrbsAccountStore, useReReadAllStoresData } from '../../store/storeHooks';
import { ITransactionCreationStepProps } from '../approvableWizardStep/ApprovableWizardStep';
import { observer } from 'mobx-react';
import { BaseStepContent, IActionButtonProps } from '../approvableWizardStep/BaseStepContent';
import { useTranslation } from 'react-i18next';
import {
  useGuardianChangingWizardTranslations,
  useWizardsCommonTranslations,
} from '../../translations/translationsHooks';
import { useTxCreationErrorHandlingEffect, useWizardState } from '../wizardHooks';
import { STAKING_ACTIONS } from '../../services/analytics/analyticConstants';
import { useAnalyticsService } from '../../services/ServicesHooks';

export interface IGuardianChangeStepContentProps {
  newGuardianAddress: string;
}

export const RewardsCalaimingStepContent = observer(
  (props: ITransactionCreationStepProps & IGuardianChangeStepContentProps) => {
    const { onPromiEventAction, skipToSuccess, txError, disableInputs, newGuardianAddress, closeWizard } = props;

    const wizardsCommonTranslations = useWizardsCommonTranslations();
    const guardianChangingWizardTranslations = useGuardianChangingWizardTranslations();
    const orbsAccountStore = useOrbsAccountStore();
    const [t] = useTranslation();
    const analyticsService = useAnalyticsService();

    const reReadStoresData = useReReadAllStoresData();

    // TODO : ORL : TRANSLATIONS
    // Start and limit by allowance
    const { message, subMessage, isBroadcastingMessage } = useWizardState(
      // guardianChangingWizardTranslations('guardianSelectionSubStep_message_changeGuardian', { newGuardianAddress }),
      'Claiming your rewards',
      // guardianChangingWizardTranslations('guardianSelectionSubStep_subMessage_pressChangeAndApprove'),
      `${orbsAccountStore.rewardsBalance.toLocaleString()} ORBS`,
      false,
    );

    // Handle error by displaying the proper error message
    useTxCreationErrorHandlingEffect(message, subMessage, isBroadcastingMessage, txError);

    const claimRewards = useCallback(() => {
      message.setValue('');
      subMessage.setValue(wizardsCommonTranslations('subMessage_pleaseApproveTransactionWithExplanation'));

      const promiEvent = orbsAccountStore.claimRewards();

      // DEV_NOTE : If we have txHash, it means the user click on 'confirm' and generated one.
      promiEvent.on('transactionHash', (txHash) => {
        subMessage.setValue(wizardsCommonTranslations('subMessage_broadcastingYourTransactionDoNotRefreshOrCloseTab'));
        isBroadcastingMessage.setTrue();
      });

      onPromiEventAction(promiEvent, () => {
        analyticsService.trackStakingContractInteractionSuccess(STAKING_ACTIONS.rewardsClaiming);
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
      reReadStoresData,
    ]);

    const claimRewardsActionButtonProps = useMemo<IActionButtonProps>(() => {
      return {
        // title: guardianChangingWizardTranslations('guardianSelectionSubStep_action_change'),
        title: 'Claim',
        onClick: claimRewards,
      };
    }, [claimRewards]);

    return (
      <BaseStepContent
        message={message.value}
        subMessage={subMessage.value}
        // title={guardianChangingWizardTranslations('guardianSelectionSubStep_stepTitle')}
        title={'Staking Rewards Claiming'}
        disableInputs={disableInputs}
        isLoading={isBroadcastingMessage.value}
        contentTestId={'wizard_sub_step_initiate_guardian_change_tx'}
        innerContent={null}
        actionButtonProps={claimRewardsActionButtonProps}
        addCancelButton
        onCancelButtonClicked={closeWizard}
        cancelButtonText={wizardsCommonTranslations('action_close')}
      />
    );
  },
);
