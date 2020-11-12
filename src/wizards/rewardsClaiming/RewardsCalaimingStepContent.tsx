import React, { useCallback, useMemo } from 'react';
import { useOrbsAccountStore, useReReadAllStoresData } from '../../store/storeHooks';
import { ITransactionCreationStepProps } from '../approvableWizardStep/ApprovableWizardStep';
import { observer } from 'mobx-react';
import { BaseStepContent, IActionButtonProps } from '../approvableWizardStep/BaseStepContent';
import {
  useCommonsTranslations,
  useRewardsClaimingWizardTranslations,
  useWizardsCommonTranslations,
} from '../../translations/translationsHooks';
import { useTxCreationErrorHandlingEffect, useWizardState } from '../wizardHooks';
import { STAKING_ACTIONS } from '../../services/analytics/analyticConstants';
import { useAnalyticsService } from '../../services/ServicesHooks';
import { Typography } from '@material-ui/core';

export interface IGuardianChangeStepContentProps {
  newGuardianAddress: string;
}

export const RewardsCalaimingStepContent = observer(
  (props: ITransactionCreationStepProps & IGuardianChangeStepContentProps) => {
    const { onPromiEventAction, skipToSuccess, txError, disableInputs, newGuardianAddress, closeWizard } = props;

    const commonsTranslations = useCommonsTranslations();
    const wizardsCommonTranslations = useWizardsCommonTranslations();
    const rewardsClaimingWizardTranslations = useRewardsClaimingWizardTranslations();
    const orbsAccountStore = useOrbsAccountStore();
    const analyticsService = useAnalyticsService();

    const reReadStoresData = useReReadAllStoresData();

    // Start and limit by allowance
    const { message, subMessage, isBroadcastingMessage } = useWizardState(
      rewardsClaimingWizardTranslations('rewardsClaimingSubStep_message_pressClaimWithExplanation'),
      rewardsClaimingWizardTranslations('rewardsClaimingSubStep_subMessage_claimingHasCost'),
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
        title: 'Claim',
        onClick: claimRewards,
      };
    }, [claimRewards]);

    const rewardsClaimingInnerContent = useMemo(() => {
      return (
        <Typography variant={'h5'}>
          {rewardsClaimingWizardTranslations('rewardsClaimingSubStep_text_rewardsBalanceIs')}{' '}
          <Typography variant={'h5'} style={{ display: 'inline' }} color={'secondary'}>
            {commonsTranslations('xOrbs', { amount: orbsAccountStore.rewardsBalance.toLocaleString() })}
          </Typography>
        </Typography>
      );
    }, [commonsTranslations, orbsAccountStore.rewardsBalance, rewardsClaimingWizardTranslations]);

    return (
      <BaseStepContent
        message={message.value}
        subMessage={subMessage.value}
        title={rewardsClaimingWizardTranslations('rewardsClaimingSubStep_stepTitle')}
        disableInputs={disableInputs}
        isLoading={isBroadcastingMessage.value}
        contentTestId={'wizard_sub_step_initiate_guardian_change_tx'}
        innerContent={rewardsClaimingInnerContent}
        actionButtonProps={claimRewardsActionButtonProps}
        addCancelButton
        onCancelButtonClicked={closeWizard}
        cancelButtonText={wizardsCommonTranslations('action_close')}
      />
    );
  },
);
