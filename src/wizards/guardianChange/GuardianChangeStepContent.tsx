import React, { useCallback, useEffect, useMemo } from 'react';
import { useStateful } from 'react-hanger';
import { useGuardiansStore } from '../../store/storeHooks';
import { ITransactionCreationStepProps } from '../approvableWizardStep/ApprovableWizardStep';
import { observer } from 'mobx-react';
import { messageFromTxCreationSubStepError, PLEASE_APPROVE_TX_MESSAGE } from '../wizardMessages';
import { BaseStepContent } from '../approvableWizardStep/BaseStepContent';
import { CommonActionButton } from '../../components/base/CommonActionButton';
import { useTranslation } from 'react-i18next';

export interface IGuardianChangeStepContentProps {
  newGuardianAddress: string;
}

export const GuardianChangeStepContent = observer(
  (props: ITransactionCreationStepProps & IGuardianChangeStepContentProps) => {
    const { onPromiEventAction, skipToSuccess, txError, disableInputs, newGuardianAddress } = props;

    const guardiansStore = useGuardiansStore();
    const [t] = useTranslation();

    // Start and limit by allowance
    const message = useStateful(`Change selected guardian to ${newGuardianAddress}`);
    const subMessage = useStateful('Press "Change" and accept the transaction');

    // Display the proper error message
    useEffect(() => {
      if (txError) {
        const { errorMessage, errorSubMessage } = messageFromTxCreationSubStepError(txError);
        message.setValue(errorMessage);
        subMessage.setValue(errorSubMessage);
      }
    }, [txError, message, subMessage]);

    const changeSelectedGuardian = useCallback(() => {
      message.setValue('');
      subMessage.setValue(PLEASE_APPROVE_TX_MESSAGE);

      const promiEvent = guardiansStore.selectGuardian(newGuardianAddress);
      onPromiEventAction(promiEvent);
    }, [guardiansStore, message, onPromiEventAction, newGuardianAddress, subMessage]);

    const guardianSelectionContent = useMemo(() => {
      return <CommonActionButton onClick={changeSelectedGuardian}>{t('Change')}</CommonActionButton>;
    }, [changeSelectedGuardian, t]);

    return (
      <BaseStepContent
        message={message.value}
        subMessage={subMessage.value}
        title={'Change selected guardian'}
        disableInputs={disableInputs}
        contentTestId={'wizard_sub_step_initiate_guardian_change_tx'}
        innerContent={guardianSelectionContent}
      />
    );
  },
);
