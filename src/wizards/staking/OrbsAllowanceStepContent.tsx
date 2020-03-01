import React, { useCallback, useEffect, useMemo } from 'react';
import { TextField } from '@material-ui/core';
import { useNumber, useStateful } from 'react-hanger';
import { useOrbsAccountStore } from '../../store/storeHooks';
import { ITransactionCreationStepProps } from '../approvableWizardStep/ApprovableWizardStep';
import { observer } from 'mobx-react';
import { fullOrbsFromWeiOrbs, weiOrbsFromFullOrbs } from '../../cryptoUtils/unitConverter';
import { messageFromTxCreationSubStepError } from '../wizardMessages';
import { BaseStepContent, IActionButtonProps } from '../approvableWizardStep/BaseStepContent';
import { useStakingWizardTranslations, useWizardsCommonTranslations } from '../../translations/translationsHooks';

export const OrbsAllowanceStepContent = observer((props: ITransactionCreationStepProps) => {
  const { disableInputs, onPromiEventAction, txError } = props;

  const wizardsCommonTranslations = useWizardsCommonTranslations();
  const stakingWizardTranslations = useStakingWizardTranslations();
  const orbsAccountStore = useOrbsAccountStore();

  // Start and limit by liquid orbs
  const liquidOrbsAsNumber = fullOrbsFromWeiOrbs(orbsAccountStore.liquidOrbs);
  const orbsAllowance = useNumber(liquidOrbsAsNumber, { lowerLimit: 0, upperLimit: liquidOrbsAsNumber });
  const message = useStateful(stakingWizardTranslations('allowanceSubStep_message_selectAmountOfOrbs'));
  const subMessage = useStateful('');

  // Calculate the proper error message
  useEffect(() => {
    if (txError) {
      const { errorMessage, errorSubMessage } = messageFromTxCreationSubStepError(txError, wizardsCommonTranslations);
      message.setValue(errorMessage);
      subMessage.setValue(errorSubMessage);
    }
  }, [txError, message, subMessage, wizardsCommonTranslations]);

  const setTokenAllowanceForStakingContract = useCallback(() => {
    message.setValue('');
    subMessage.setValue(wizardsCommonTranslations('subMessage_pleaseApproveTransactionWithExplanation'));

    const promiEvent = orbsAccountStore.setAllowanceForStakingContract(weiOrbsFromFullOrbs(orbsAllowance.value));
    onPromiEventAction(promiEvent);
  }, [message, subMessage, wizardsCommonTranslations, orbsAccountStore, orbsAllowance.value, onPromiEventAction]);

  const actionButtonProps = useMemo<IActionButtonProps>(
    () => ({
      onClick: setTokenAllowanceForStakingContract,
      title: stakingWizardTranslations('allowanceSubStep_action_approve'),
    }),
    [setTokenAllowanceForStakingContract, stakingWizardTranslations],
  );

  // TODO : O.L : Add a number formatter here to display the sums with proper separation
  //  https://material-ui.com/components/text-fields/#FormattedInputs.tsx
  const allowanceInput = useMemo(() => {
    return (
      <TextField
        id={'orbsAllowance'}
        label={stakingWizardTranslations('allowanceSubStep_label_allowance')}
        type={'number'}
        value={orbsAllowance.value}
        onChange={e => orbsAllowance.setValue(parseInt(e.target.value))}
      />
    );
  }, [orbsAllowance, stakingWizardTranslations]);

  // TODO : O.L : Use proper grid system instead of the 'br's
  return (
    <BaseStepContent
      message={message.value}
      subMessage={subMessage.value}
      title={stakingWizardTranslations('allowanceSubStep_stepTitle')}
      infoTitle={stakingWizardTranslations('allowanceSubStep_stepExplanation')}
      disableInputs={disableInputs}
      contentTestId={'wizard_sub_step_initiate_allowance_tx'}
      actionButtonProps={actionButtonProps}
      innerContent={allowanceInput}
    />
  );
});
