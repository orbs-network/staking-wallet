import React, { useCallback, useMemo, useState } from 'react';
import { useOrbsAccountStore, useReReadAllStoresData } from '../../store/storeHooks';
import { ITransactionCreationStepProps } from '../approvableWizardStep/ApprovableWizardStep';
import { observer } from 'mobx-react';
import { fullOrbsFromWeiOrbs, fullOrbsFromWeiOrbsString, weiOrbsFromFullOrbs } from '../../cryptoUtils/unitConverter';
import { BaseStepContent, IActionButtonProps } from '../approvableWizardStep/BaseStepContent';
import { useStakingWizardTranslations, useWizardsCommonTranslations } from '../../translations/translationsHooks';
import { useTxCreationErrorHandlingEffect, useWizardState } from '../wizardHooks';
import { useAnalyticsService } from '../../services/ServicesHooks';
import { STAKING_ACTIONS } from '../../services/analytics/analyticConstants';
import handleApprove from '../helpers/handle-approve';
import { hanleStakingError } from '../helpers/error-handling';
import { formatStringAsNumber } from '../../utils/stringUtils';
import StakingInput from '../components/staking-input';
import stakingUtil from '../../utils/stakingUtil';
export interface IOrbsStakingStepContentProps {
  goBackToApproveStep: () => void;
  stakeAmountFromApprovalStep: string;
  goBackToChooseGuardianStep: () => void;
}

export const OrbsStakingStepContent = observer(
  (props: ITransactionCreationStepProps & IOrbsStakingStepContentProps) => {
    const {
      disableInputs,
      onPromiEventAction,
      txError,
      goBackToApproveStep,
      closeWizard,
      stakeAmountFromApprovalStep,
      goBackToChooseGuardianStep,
    } = props;

    const wizardsCommonTranslations = useWizardsCommonTranslations();
    const stakingWizardTranslations = useStakingWizardTranslations();
    const orbsAccountStore = useOrbsAccountStore();
    const analyticsService = useAnalyticsService();


    // Start and limit by allowance
    const orbsForStaking = orbsAccountStore.stakingContractAllowance;

    const fullOrbsForStaking = fullOrbsFromWeiOrbs(orbsForStaking);
    const { message, subMessage, isBroadcastingMessage } = useWizardState('', '', false);
    const [stakeAmount, setStakeAmount] = useState(stakeAmountFromApprovalStep);


    const liquidOrbsAsString = fullOrbsFromWeiOrbsString(orbsAccountStore.liquidOrbs);

    const isApproveEnabled = stakingUtil.isApproveEnabled(liquidOrbsAsString, stakeAmount)
    useTxCreationErrorHandlingEffect(message, subMessage, isBroadcastingMessage, txError);
    const stake = useCallback(() => {
      handleApprove({
        isApproveEnabled,
        message,
        subMessage,
        promiEvent: orbsAccountStore.stakeTokens(weiOrbsFromFullOrbs(stakeAmount)),
        isBroadcastingMessage,
        onPromiEventAction,
        wizardsCommonTranslations,
        errorHandler: hanleStakingError,
        analyticsHandler: analyticsService.trackStakingContractInteractionSuccess(
          STAKING_ACTIONS.staking,
          fullOrbsForStaking,
        ),
      });
    }, [
      message,
      subMessage,
      orbsAccountStore,
      stakeAmount,
      isBroadcastingMessage,
      onPromiEventAction,
      wizardsCommonTranslations,
      analyticsService,
      fullOrbsForStaking,
    ]);

    const actionButtonProps = useMemo<IActionButtonProps>(
      () => ({
        onClick: stake,
        title: stakingWizardTranslations('stakingSubStep_action_stake'),
        isDisabled: !isApproveEnabled
      }),
      [stake, stakingWizardTranslations, isApproveEnabled],
    );


    const allowanceInput = (
      <StakingInput
        id='orbsAllowance'
        placeholder={wizardsCommonTranslations('popup_input_placeholder')}
        value={stakeAmount}
        onChange={setStakeAmount}
        disabled={disableInputs}
        showMaxBtn={stakingUtil.isMaxBtnEnabled(stakeAmount, liquidOrbsAsString, disableInputs)}
        handleMax={() => setStakeAmount(liquidOrbsAsString)}
        maxText={wizardsCommonTranslations('popup_max')}
      />
    );

    return (
      <BaseStepContent
        message={message.value}
        subMessage={subMessage.value}
        title={stakingWizardTranslations('stakingSubStep_stepTitle', {
          orbsForStaking: formatStringAsNumber(stakeAmount, true, 4) || 0,
        })}
        infoTitle={stakingWizardTranslations('stakingSubStep_stepExplanation')}
        isLoading={isBroadcastingMessage.value}
        contentTestId={'wizard_sub_step_initiate_staking_tx'}
        actionButtonProps={actionButtonProps}
        innerContent={allowanceInput}
        addCancelButton={true}
        onCancelButtonClicked={goBackToChooseGuardianStep}
        close={closeWizard}
        cancelButtonText={stakingWizardTranslations('backToStep_changeGuardian')}
      />
    );
  },
);
