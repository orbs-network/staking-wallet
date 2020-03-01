import React, { useCallback, useEffect, useMemo } from 'react';
import { TextField } from '@material-ui/core';
import { useNumber, useStateful } from 'react-hanger';
import { useOrbsAccountStore } from '../../store/storeHooks';
import { ITransactionCreationStepProps } from '../approvableWizardStep/ApprovableWizardStep';
import { observer } from 'mobx-react';
import { fullOrbsFromWeiOrbs, weiOrbsFromFullOrbs } from '../../cryptoUtils/unitConverter';
import { messageFromTxCreationSubStepError } from '../wizardMessages';
import { BaseStepContent, IActionButtonProps } from '../approvableWizardStep/BaseStepContent';
import { useUnstakingWizardTranslations, useWizardsCommonTranslations } from '../../translations/translationsHooks';

export const OrbsUntakingStepContent = observer((props: ITransactionCreationStepProps) => {
  const { disableInputs, onPromiEventAction, txError } = props;

  const wizardsCommonTranslations = useWizardsCommonTranslations();
  const unstakingWizardTranslations = useUnstakingWizardTranslations();
  const orbsAccountStore = useOrbsAccountStore();

  // Start and limit by allowance
  const stakedOrbsNumericalFormat = fullOrbsFromWeiOrbs(orbsAccountStore.stakedOrbs);
  const orbsForUnstaking = useNumber(0, {
    lowerLimit: 0,
    upperLimit: stakedOrbsNumericalFormat,
  });
  const message = useStateful(unstakingWizardTranslations('unstakingSubStep_message_selectAmountOfOrbs'));
  const subMessage = useStateful(unstakingWizardTranslations('unstakingSubStep_subMessage_pressUnstakeAndApprove'));

  // Display the proper error message
  useEffect(() => {
    if (txError) {
      const { errorMessage, errorSubMessage } = messageFromTxCreationSubStepError(txError);
      message.setValue(errorMessage);
      subMessage.setValue(errorSubMessage);
    }
  }, [txError, message, subMessage]);

  const unstakeTokens = useCallback(() => {
    message.setValue('');
    subMessage.setValue(wizardsCommonTranslations('subMessage_pleaseApproveTransactionWithExplanation'));

    const promiEvent = orbsAccountStore.unstakeTokens(weiOrbsFromFullOrbs(orbsForUnstaking.value));
    onPromiEventAction(promiEvent);
  }, [message, subMessage, wizardsCommonTranslations, orbsAccountStore, orbsForUnstaking.value, onPromiEventAction]);

  const actionButtonProps = useMemo<IActionButtonProps>(
    () => ({
      onClick: unstakeTokens,
      title: unstakingWizardTranslations('unstakingSubStep_action_unstake'),
    }),
    [unstakeTokens, unstakingWizardTranslations],
  );

  // TODO : O.L : Add a number formatter here to display the sums with proper separation
  //  https://material-ui.com/components/text-fields/#FormattedInputs.tsx
  const unstakingInput = useMemo(() => {
    return (
      <TextField
        id={'orbsUnstaking'}
        label={unstakingWizardTranslations('unstakingSubStep_inputLabel')}
        type={'number'}
        value={orbsForUnstaking.value}
        onChange={e => orbsForUnstaking.setValue(parseInt(e.target.value))}
      />
    );
  }, [orbsForUnstaking, unstakingWizardTranslations]);

  // TODO : O.L : Use proper grid system instead of the 'br's
  return (
    <BaseStepContent
      message={message.value}
      subMessage={subMessage.value}
      title={unstakingWizardTranslations('unstakingSubStep_stepTitle')}
      infoTitle={unstakingWizardTranslations('unstakingSubStep_stepExplanation')}
      disableInputs={disableInputs}
      contentTestId={'wizard_sub_step_initiate_unstaking_tx'}
      actionButtonProps={actionButtonProps}
      innerContent={unstakingInput}
    />
  );
});
