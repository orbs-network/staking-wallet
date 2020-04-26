import React, { useCallback, useMemo } from 'react';
import { useNumber } from 'react-hanger';
import { useOrbsAccountStore } from '../../store/storeHooks';
import { ITransactionCreationStepProps } from '../approvableWizardStep/ApprovableWizardStep';
import { observer } from 'mobx-react';
import { fullOrbsFromWeiOrbs, weiOrbsFromFullOrbs } from '../../cryptoUtils/unitConverter';
import { BaseStepContent, IActionButtonProps } from '../approvableWizardStep/BaseStepContent';
import { useStakingWizardTranslations, useWizardsCommonTranslations } from '../../translations/translationsHooks';
import { FullWidthOrbsInputField } from '../../components/inputs/FullWidthOrbsInputField';
import { useTxCreationErrorHandlingEffect, useWizardState } from '../wizardHooks';

export const OrbsAllowanceStepContent = observer((props: ITransactionCreationStepProps) => {
  const { disableInputs, onPromiEventAction, txError, closeWizard } = props;

  const wizardsCommonTranslations = useWizardsCommonTranslations();
  const stakingWizardTranslations = useStakingWizardTranslations();
  const orbsAccountStore = useOrbsAccountStore();

  // Start and limit by liquid orbs
  const liquidOrbsAsNumber = fullOrbsFromWeiOrbs(orbsAccountStore.liquidOrbs)
  const orbsAllowance = useNumber(liquidOrbsAsNumber, { lowerLimit: 0, upperLimit: liquidOrbsAsNumber });

  const { message, subMessage, isBroadcastingMessage } = useWizardState(
    stakingWizardTranslations('allowanceSubStep_message_selectAmountOfOrbs'),
    '',
    false,
  );

  // Handle error by displaying the proper error message
  useTxCreationErrorHandlingEffect(message, subMessage, isBroadcastingMessage, txError);

  const setTokenAllowanceForStakingContract = useCallback(() => {
    message.setValue('');
    subMessage.setValue(wizardsCommonTranslations('subMessage_pleaseApproveTransactionWithExplanation'));

    const promiEvent = orbsAccountStore.setAllowanceForStakingContract(weiOrbsFromFullOrbs(orbsAllowance.value));

    // DEV_NOTE : If we have txHash, it means the user click on 'confirm' and generated one.
    promiEvent.on('transactionHash', (txHash) => {
      subMessage.setValue(wizardsCommonTranslations('subMessage_broadcastingYourTransactionDoNotRefreshOrCloseTab'));
      isBroadcastingMessage.setTrue();
    });

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
        onChange={(value) => orbsAllowance.setValue(Math.min(value, liquidOrbsAsNumber))}
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
