import React, { useCallback, useMemo, useState } from 'react';
import { useOrbsAccountStore, useReReadAllStoresData } from '../../store/storeHooks';
import { ITransactionCreationStepProps } from '../approvableWizardStep/ApprovableWizardStep';
import { observer } from 'mobx-react';
import { fullOrbsFromWeiOrbsString, weiOrbsFromFullOrbs } from '../../cryptoUtils/unitConverter';
import { BaseStepContent, IActionButtonProps } from '../approvableWizardStep/BaseStepContent';
import { useStakingWizardTranslations, useWizardsCommonTranslations } from '../../translations/translationsHooks';
import { useTxCreationErrorHandlingEffect, useWizardState } from '../wizardHooks';
import stakingUtil from '../../utils/stakingUtil';
import handleApprove from '../helpers/handle-approve';
import { hanleStakingAllowanceError } from '../helpers/error-handling';
import { ALLOWANCE_APPROVAL_AMOUNT_TO_SET } from '../../constants';
export interface IOrbsAllowanceStepContentProps {
  goBackToChooseGuardianStep: () => void;
  setAmount: (val: string) => void;
  stakeAmountFromApprovalStep: string;
}

export const OrbsAllowanceStepContent = observer(
  (props: ITransactionCreationStepProps & IOrbsAllowanceStepContentProps) => {
    const {
      disableInputs,
      onPromiEventAction,
      txError,
      closeWizard,
      goBackToChooseGuardianStep,
      stakeAmountFromApprovalStep,
    } = props;

    const wizardsCommonTranslations = useWizardsCommonTranslations();
    const stakingWizardTranslations = useStakingWizardTranslations();
    const orbsAccountStore = useOrbsAccountStore();

    // Start and limit by liquid orbs
    const liquidOrbsAsString = fullOrbsFromWeiOrbsString(orbsAccountStore.liquidOrbs);
    const { message, subMessage, isBroadcastingMessage } = useWizardState(
      stakingWizardTranslations('allowanceSubStep_message_selectAmountOfOrbs'),
      '',
      false,
    );

    // Handle error by displaying the proper error message
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useTxCreationErrorHandlingEffect(message, subMessage, isBroadcastingMessage, txError);
    const isApproveEnabled = stakingUtil.isApproveEnabled(liquidOrbsAsString, stakeAmountFromApprovalStep);
    const handleAllowance = useCallback(
      () =>
        handleApprove({
          isApproveEnabled,
          message,
          subMessage,
          promiEvent: orbsAccountStore.setAllowanceForStakingContract(ALLOWANCE_APPROVAL_AMOUNT_TO_SET),
          isBroadcastingMessage,
          onPromiEventAction,
          reReadStoresData: () => {},
          wizardsCommonTranslations,
          errorHandler: hanleStakingAllowanceError,
          warnMsg: `tried to set out of range allowance of ${stakeAmountFromApprovalStep}`,
        }),
      [
        isApproveEnabled,
        isBroadcastingMessage,
        message,
        onPromiEventAction,
        orbsAccountStore,
        stakeAmountFromApprovalStep,
        subMessage,
        wizardsCommonTranslations,
      ],
    );

    const actionButtonProps = useMemo<IActionButtonProps>(
      () => ({
        onClick: handleAllowance,
        title: stakingWizardTranslations('allowanceSubStep_action_approve'),
        isDisabled: !isApproveEnabled,
      }),
      [isApproveEnabled, handleAllowance, stakingWizardTranslations],
    );

    return (
      <BaseStepContent
        subMessage={subMessage.value}
        title={stakingWizardTranslations('allowanceSubStep_stepTitle')}
        infoTitle={stakingWizardTranslations('allowanceSubStep_stepExplanation')}
        disableInputs={disableInputs}
        isLoading={isBroadcastingMessage.value}
        contentTestId={'wizard_sub_step_initiate_allowance_tx'}
        actionButtonProps={actionButtonProps}
        addCancelButton
        close={closeWizard}
        onCancelButtonClicked={goBackToChooseGuardianStep}
        cancelButtonText={stakingWizardTranslations('backToStep_changeGuardian')}
      />
    );
  },
);
