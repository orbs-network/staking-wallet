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
import handleApprove from '../helpers/handle-approve';
import { handleRewardClaimingError } from '../helpers/error-handling';
import { formatStringAsNumber } from '../../utils/stringUtils';
import useTheme from '@material-ui/core/styles/useTheme';

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
    const theme = useTheme();
    // Start and limit by allowance
    const { message, subMessage, isBroadcastingMessage } = useWizardState(
      rewardsClaimingWizardTranslations('rewardsClaimingSubStep_message_pressClaimWithExplanation'),
      rewardsClaimingWizardTranslations('rewardsClaimingSubStep_subMessage_claimingHasCost'),
      false,
    );

    // Handle error by displaying the proper error message
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useTxCreationErrorHandlingEffect(message, subMessage, isBroadcastingMessage, txError);

    const claimRewards = useCallback(
      () =>
        handleApprove({
          message,
          subMessage,
          promiEvent: orbsAccountStore.claimRewards(),
          isBroadcastingMessage,
          onPromiEventAction,
          wizardsCommonTranslations,
          errorHandler: handleRewardClaimingError,
          analyticsHandler: analyticsService.trackStakingContractInteractionSuccess(STAKING_ACTIONS.rewardsClaiming),
        }),
      [
        isBroadcastingMessage,
        message,
        onPromiEventAction,
        orbsAccountStore,
        subMessage,
        wizardsCommonTranslations,
        analyticsService,
      ],
    );

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
          <span style={{ display: 'inline', color: theme.chain.current.mainColor }}>
            {commonsTranslations('xOrbs', {
              amount: formatStringAsNumber(orbsAccountStore.rewardsBalance.toString(), true),
            })}
          </span>
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
