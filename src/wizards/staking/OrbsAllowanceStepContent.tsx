import React, { useCallback, useEffect, useMemo } from 'react';
import { useNumber, useStateful, useBoolean } from 'react-hanger';
import { useOrbsAccountStore } from '../../store/storeHooks';
import { ITransactionCreationStepProps } from '../approvableWizardStep/ApprovableWizardStep';
import { observer } from 'mobx-react';
import { fullOrbsFromWeiOrbs, weiOrbsFromFullOrbs } from '../../cryptoUtils/unitConverter';
import { messageFromTxCreationSubStepError } from '../wizardMessages';
import { BaseStepContent, IActionButtonProps } from '../approvableWizardStep/BaseStepContent';
import { useStakingWizardTranslations, useWizardsCommonTranslations } from '../../translations/translationsHooks';
import { FullWidthOrbsInputField } from '../../components/inputs/FullWidthOrbsInputField';

export const OrbsAllowanceStepContent = observer((props: ITransactionCreationStepProps) => {
  const { disableInputs, onPromiEventAction, txError, closeWizard } = props;

  const wizardsCommonTranslations = useWizardsCommonTranslations();
  const stakingWizardTranslations = useStakingWizardTranslations();
  const orbsAccountStore = useOrbsAccountStore();

  // Start and limit by liquid orbs
  const liquidOrbsAsNumber = fullOrbsFromWeiOrbs(orbsAccountStore.liquidOrbs);
  const orbsAllowance = useNumber(liquidOrbsAsNumber, { lowerLimit: 0, upperLimit: liquidOrbsAsNumber });
  const message = useStateful(stakingWizardTranslations('allowanceSubStep_message_selectAmountOfOrbs'));
  const subMessage = useStateful('');
  const isBroadcastingMessage = useBoolean(false);

  // Calculate the proper error message
  useEffect(() => {
    if (txError) {
      const { errorMessage, errorSubMessage } = messageFromTxCreationSubStepError(txError, wizardsCommonTranslations);
      message.setValue(errorMessage);
      subMessage.setValue(errorSubMessage);
      isBroadcastingMessage.setFalse();
    }
  }, [txError, message, subMessage, wizardsCommonTranslations, isBroadcastingMessage]);

  const setTokenAllowanceForStakingContract = useCallback(() => {
    message.setValue('');
    subMessage.setValue(wizardsCommonTranslations('subMessage_pleaseApproveTransactionWithExplanation'));
    isBroadcastingMessage.setTrue();

    const promiEvent = orbsAccountStore.setAllowanceForStakingContract(weiOrbsFromFullOrbs(orbsAllowance.value));
    onPromiEventAction(promiEvent);
  }, [
    message,
    subMessage,
    wizardsCommonTranslations,
    orbsAccountStore,
    orbsAllowance.value,
    onPromiEventAction,
    isBroadcastingMessage,
  ]);

  const actionButtonProps = useMemo<IActionButtonProps>(
    () => ({
      onClick: setTokenAllowanceForStakingContract,
      title: stakingWizardTranslations('allowanceSubStep_action_approve'),
    }),
    [setTokenAllowanceForStakingContract, stakingWizardTranslations],
  );

  const allowanceInput = useMemo(() => {
    return (
      <FullWidthOrbsInputField
        id={'orbsAllowance'}
        label={stakingWizardTranslations('allowanceSubStep_label_allowance')}
        value={orbsAllowance.value}
        onChange={(value) => orbsAllowance.setValue(value)}
        disabled={disableInputs}
      />
    );
  }, [orbsAllowance, stakingWizardTranslations, disableInputs]);

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
      onCancelButtonClicked={closeWizard}
    />
  );
});
