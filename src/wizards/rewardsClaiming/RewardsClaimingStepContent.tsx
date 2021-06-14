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
import errorMonitoring from '../../services/error-monitoring';
import { handleNumberAsStringToDisplay, numberToString } from '../../utils/numberUtils';
import constants from '../../constants/constants';

export interface IRewardsClaimingStepContentProps {
  shouldAddSkip?: boolean;
  skipToNextStep?: () => void;
}

export const RewardsClaimingStepContent = observer(
  (props: ITransactionCreationStepProps & IRewardsClaimingStepContentProps) => {
    const {
      onPromiEventAction,
      skipToSuccess,
      txError,
      disableInputs,
      shouldAddSkip,
      skipToNextStep,
      closeWizard,
    } = props;

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

      promiEvent.on('error', (error: Error) => {
        const { errorMessages, captureException } = errorMonitoring;
        const customMsg = errorMessages.stakingError('rewards claiming', error.message);
        captureException(error, 'rewards claiming', customMsg);
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
        title: rewardsClaimingWizardTranslations('rewardsClaimingSubStep_action_claim'),
        onClick: claimRewards,
      };
    }, [claimRewards, rewardsClaimingWizardTranslations]);

    const rewardsClaimingInnerContent = useMemo(() => {
      return (
        <Typography variant={'h5'}>
          {rewardsClaimingWizardTranslations('rewardsClaimingSubStep_text_rewardsBalanceIs')}{' '}
          <Typography variant={'h5'} style={{ display: 'inline' }} color={'secondary'}>
            {commonsTranslations('xOrbs', {
              amount: handleNumberAsStringToDisplay(
                numberToString(orbsAccountStore.rewardsBalance),
                constants.numbersDecimalToDisplayLimit,
                true,
              ),
            })}
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
        close={closeWizard}
        onCancelButtonClicked={shouldAddSkip ? (skipToNextStep ? skipToNextStep : closeWizard) : closeWizard}
        cancelButtonText={
          shouldAddSkip ? wizardsCommonTranslations('action_skip') : wizardsCommonTranslations('action_close')
        }
      />
    );
  },
);
