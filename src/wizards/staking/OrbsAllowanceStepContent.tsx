import React, { useCallback, useMemo, useState } from 'react';
import { useOrbsAccountStore, useReReadAllStoresData } from '../../store/storeHooks';
import { ITransactionCreationStepProps } from '../approvableWizardStep/ApprovableWizardStep';
import { observer } from 'mobx-react';
import { fullOrbsFromWeiOrbsString, weiOrbsFromFullOrbs } from '../../cryptoUtils/unitConverter';
import { BaseStepContent, IActionButtonProps } from '../approvableWizardStep/BaseStepContent';
import { useStakingWizardTranslations, useWizardsCommonTranslations } from '../../translations/translationsHooks';
import { useTxCreationErrorHandlingEffect, useWizardState } from '../wizardHooks';
import stakingUtil from '../../utils/stakingUtil';
import StakingInput from '../components/staking-input';
import handleApprove from '../helpers/handle-approve';
import { hanleStakingAllowanceError } from '../helpers/error-handling';
export interface IOrbsAllowanceStepContentProps {
  goBackToChooseGuardianStep: () => void;
}

export const OrbsAllowanceStepContent = observer(
  (props: ITransactionCreationStepProps & IOrbsAllowanceStepContentProps) => {
    const { disableInputs, onPromiEventAction, txError, closeWizard, goBackToChooseGuardianStep } = props;

    const wizardsCommonTranslations = useWizardsCommonTranslations();
    const stakingWizardTranslations = useStakingWizardTranslations();
    const orbsAccountStore = useOrbsAccountStore();

    const reReadStoresData = useReReadAllStoresData();

    // Start and limit by liquid orbs
    const liquidOrbsAsString = fullOrbsFromWeiOrbsString(orbsAccountStore.liquidOrbs);
    const [orbsAllowance, setOrbsAllowance] = useState<string>(liquidOrbsAsString);

    const { message, subMessage, isBroadcastingMessage } = useWizardState(
      stakingWizardTranslations('allowanceSubStep_message_selectAmountOfOrbs'),
      '',
      false,
    );

    // Handle error by displaying the proper error message
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useTxCreationErrorHandlingEffect(message, subMessage, isBroadcastingMessage, txError);

    const isApproveEnabled = stakingUtil.isApproveEnabled(liquidOrbsAsString, orbsAllowance);
    const handleAllowance = useCallback(
      () =>
        handleApprove({
          isApproveEnabled,
          message,
          subMessage,
          promiEvent: orbsAccountStore.setAllowanceForStakingContract(weiOrbsFromFullOrbs(orbsAllowance)),
          isBroadcastingMessage,
          onPromiEventAction,
          reReadStoresData,
          wizardsCommonTranslations,
          errorHandler: hanleStakingAllowanceError,
          warnMsg: `tried to set out of range allowance of ${orbsAllowance}`,
        }),
      [
        isApproveEnabled,
        isBroadcastingMessage,
        message,
        onPromiEventAction,
        orbsAccountStore,
        orbsAllowance,
        reReadStoresData,
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

    const allowanceInput = (
      <StakingInput
        id='orbsAllowance'
        placeholder={wizardsCommonTranslations('popup_input_placeholder')}
        value={orbsAllowance}
        onChange={setOrbsAllowance}
        disabled={disableInputs}
        showMaxBtn={stakingUtil.isMaxBtnEnabled(orbsAllowance, liquidOrbsAsString, disableInputs)}
        handleMax={() => setOrbsAllowance(liquidOrbsAsString)}
        maxText={wizardsCommonTranslations('popup_max')}
      />
    );

    return (
      <BaseStepContent
        message={message.value}
        subMessage={subMessage.value}
        title={stakingWizardTranslations('allowanceSubStep_stepTitle')}
        infoTitle={stakingWizardTranslations('allowanceSubStep_stepExplanation')}
        disableInputs={disableInputs}
        isLoading={isBroadcastingMessage.value}
        contentTestId={'wizard_sub_step_initiate_allowance_tx'}
        actionButtonProps={actionButtonProps}
        innerContent={allowanceInput}
        addCancelButton
        close={closeWizard}
        onCancelButtonClicked={goBackToChooseGuardianStep}
        cancelButtonText={stakingWizardTranslations('backToStep_changeGuardian')}
      />
    );
  },
);
