import React, { useCallback, useEffect, useMemo } from 'react';
import { useStateful } from 'react-hanger';
import { useGuardiansStore } from '../../store/storeHooks';
import { ITransactionCreationStepProps } from '../approvableWizardStep/ApprovableWizardStep';
import { observer } from 'mobx-react';
import { messageFromTxCreationSubStepError } from '../wizardMessages';
import { BaseStepContent, IActionButtonProps } from '../approvableWizardStep/BaseStepContent';
import { CommonActionButton } from '../../components/base/CommonActionButton';
import { useTranslation } from 'react-i18next';
import {
  useGuardianChangingWizardTranslations,
  useWizardsCommonTranslations,
} from '../../translations/translationsHooks';

export interface IGuardianChangeStepContentProps {
  newGuardianAddress: string;
}

export const GuardianChangeStepContent = observer(
  (props: ITransactionCreationStepProps & IGuardianChangeStepContentProps) => {
    const { onPromiEventAction, skipToSuccess, txError, disableInputs, newGuardianAddress, closeWizard } = props;

    const wizardsCommonTranslations = useWizardsCommonTranslations();
    const guardianChangingWizardTranslations = useGuardianChangingWizardTranslations();
    const guardiansStore = useGuardiansStore();
    const [t] = useTranslation();

    // Start and limit by allowance
    const message = useStateful(
      guardianChangingWizardTranslations('guardianSelectionSubStep_message_changeGuardian', { newGuardianAddress }),
    );
    const subMessage = useStateful(
      guardianChangingWizardTranslations('guardianSelectionSubStep_subMessage_pressChangeAndApprove'),
    );

    // Display the proper error message
    useEffect(() => {
      if (txError) {
        const { errorMessage, errorSubMessage } = messageFromTxCreationSubStepError(txError, wizardsCommonTranslations);
        message.setValue(errorMessage);
        subMessage.setValue(errorSubMessage);
      }
    }, [txError, message, subMessage, wizardsCommonTranslations]);

    const changeSelectedGuardian = useCallback(() => {
      message.setValue('');
      subMessage.setValue(wizardsCommonTranslations('subMessage_pleaseApproveTransactionWithExplanation'));

      const promiEvent = guardiansStore.selectGuardian(newGuardianAddress);
      onPromiEventAction(promiEvent);
    }, [message, subMessage, wizardsCommonTranslations, guardiansStore, newGuardianAddress, onPromiEventAction]);

    const changeGuardianActionButtonProps = useMemo<IActionButtonProps>(() => {
      return {
        title: guardianChangingWizardTranslations('guardianSelectionSubStep_action_change'),
        onClick: changeSelectedGuardian
      };
    }, [changeSelectedGuardian, guardianChangingWizardTranslations]);

    return (
      <BaseStepContent
        message={message.value}
        subMessage={subMessage.value}
        title={guardianChangingWizardTranslations('guardianSelectionSubStep_stepTitle')}
        disableInputs={disableInputs}
        contentTestId={'wizard_sub_step_initiate_guardian_change_tx'}
        innerContent={null}
        actionButtonProps={changeGuardianActionButtonProps}
        addCancelButton
        onCancelButtonClicked={closeWizard}
      />
    );
  },
);
