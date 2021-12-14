import React, { useCallback, useMemo } from 'react';
import { useOrbsAccountStore, useReReadAllStoresData } from '../../store/storeHooks';
import { ITransactionCreationStepProps } from '../approvableWizardStep/ApprovableWizardStep';
import { observer } from 'mobx-react';
import { fullOrbsFromWeiOrbs, fullOrbsFromWeiOrbsString } from '../../cryptoUtils/unitConverter';
import { BaseStepContent, IActionButtonProps } from '../approvableWizardStep/BaseStepContent';
import { useStakingWizardTranslations, useWizardsCommonTranslations } from '../../translations/translationsHooks';
import { useTxCreationErrorHandlingEffect, useWizardState } from '../wizardHooks';
import { useAnalyticsService } from '../../services/ServicesHooks';
import { STAKING_ACTIONS } from '../../services/analytics/analyticConstants';
import constants from '../../constants/constants';
import handleApprove from '../helpers/handle-approve';
import { hanleStakingError } from '../helpers/error-handling';
import { formatStringAsNumber } from '../../utils/stringUtils';
export interface IOrbsStakingStepContentProps {
  goBackToApproveStep: () => void;
}

export const OrbsStakingStepContent = observer(
  (props: ITransactionCreationStepProps & IOrbsStakingStepContentProps) => {
    const { disableInputs, onPromiEventAction, txError, goBackToApproveStep, closeWizard } = props;

    const wizardsCommonTranslations = useWizardsCommonTranslations();
    const stakingWizardTranslations = useStakingWizardTranslations();
    const orbsAccountStore = useOrbsAccountStore();
    const analyticsService = useAnalyticsService();

    const reReadStoresData = useReReadAllStoresData();

    // Start and limit by allowance
    const orbsForStaking = orbsAccountStore.stakingContractAllowance;

    const fullOrbsForStaking = fullOrbsFromWeiOrbs(orbsForStaking);
    const fullOrbsForStakingString = fullOrbsFromWeiOrbsString(orbsForStaking);
    const { message, subMessage, isBroadcastingMessage } = useWizardState('', '', false);

    // Handle error by displaying the proper error message
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useTxCreationErrorHandlingEffect(message, subMessage, isBroadcastingMessage, txError);
    const stake = useCallback(() => {
      handleApprove({
        message,
        subMessage,
        promiEvent: orbsAccountStore.stakeTokens(orbsForStaking),
        isBroadcastingMessage,
        onPromiEventAction,
        reReadStoresData,
        wizardsCommonTranslations,
        errorHandler: hanleStakingError,
        analyticsHandler: analyticsService.trackStakingContractInteractionSuccess(
          STAKING_ACTIONS.staking,
          fullOrbsForStaking,
        ),
      });
    }, [
      analyticsService,
      isBroadcastingMessage,
      message,
      onPromiEventAction,
      orbsAccountStore,
      reReadStoresData,
      subMessage,
      wizardsCommonTranslations,
      orbsForStaking,
      fullOrbsForStaking,
    ]);

    const actionButtonProps = useMemo<IActionButtonProps>(
      () => ({
        onClick: stake,
        title: stakingWizardTranslations('stakingSubStep_action_stake'),
      }),
      [stake, stakingWizardTranslations],
    );

    return (
      <BaseStepContent
        message={message.value}
        subMessage={subMessage.value}
        title={stakingWizardTranslations('stakingSubStep_stepTitle', {
          orbsForStaking: formatStringAsNumber(fullOrbsForStakingString, true),
        })}
        infoTitle={stakingWizardTranslations('stakingSubStep_stepExplanation')}
        disableInputs={disableInputs}
        isLoading={isBroadcastingMessage.value}
        contentTestId={'wizard_sub_step_initiate_staking_tx'}
        actionButtonProps={actionButtonProps}
        addCancelButton={true}
        onCancelButtonClicked={goBackToApproveStep}
        close={closeWizard}
        cancelButtonText={stakingWizardTranslations('backToStep_changeAmount')}
      />
    );
  },
);
