import React, { useCallback, useEffect, useMemo } from 'react';
import { useStateful } from 'react-hanger';
import { useGuardiansStore } from '../../store/storeHooks';
import { ITransactionCreationStepProps } from '../approvableWizardStep/ApprovableWizardStep';
import { observer } from 'mobx-react';
import { GuardiansTable } from '../../components/GuardiansTable';
import { TGuardianInfoExtended } from '../../store/GuardiansStore';
import { messageFromTxCreationSubStepError } from '../wizardMessages';
import { BaseStepContent } from '../approvableWizardStep/BaseStepContent';
import { useWizardsCommonTranslations } from '../../translations/translationsHooks';

export interface IGuardianSelectionStepContentProps {
  selectedGuardianAddress: string;
}

export const GuardianSelectionStepContent = observer(
  (props: ITransactionCreationStepProps & IGuardianSelectionStepContentProps) => {
    const { onPromiEventAction, skipToSuccess, txError, disableInputs, selectedGuardianAddress } = props;

    const wizardsCommonTranslations = useWizardsCommonTranslations();
    const guardiansStore = useGuardiansStore();

    // Start and limit by allowance
    const message = useStateful('Select a guardian');
    const subMessage = useStateful('Press "Select" and accept the transaction');

    // Display the proper error message
    useEffect(() => {
      if (txError) {
        const { errorMessage, errorSubMessage } = messageFromTxCreationSubStepError(txError);
        message.setValue(errorMessage);
        subMessage.setValue(errorSubMessage);
      }
    }, [txError, message, subMessage]);

    const selectGuardian = useCallback(
      (guardian: TGuardianInfoExtended) => {
        message.setValue('');
        subMessage.setValue(wizardsCommonTranslations('subMessage_pleaseApproveTransactionWithExplanation'));

        // No need to re-select an already selected guardian
        if (guardian.address === selectedGuardianAddress) {
          skipToSuccess();
        } else {
          const promiEvent = guardiansStore.selectGuardian(guardian.address);
          onPromiEventAction(promiEvent);
        }
      },
      [
        guardiansStore,
        message,
        onPromiEventAction,
        selectedGuardianAddress,
        skipToSuccess,
        subMessage,
        wizardsCommonTranslations,
      ],
    );

    const guardianSelectionContent = useMemo(() => {
      return (
        <GuardiansTable
          guardianSelectionMode={'Select'}
          guardians={guardiansStore.guardiansList}
          onGuardianSelect={selectGuardian}
          selectedGuardian={selectedGuardianAddress}
          tableTestId={'guardian_selection_sub_step_guardians_table'}
          extraStyle={{ marginLeft: '1em', marginRight: '1em' }}
        />
      );
    }, [guardiansStore.guardiansList, selectGuardian, selectedGuardianAddress]);

    return (
      <BaseStepContent
        message={message.value}
        subMessage={subMessage.value}
        title={'Select your guardian'}
        infoTitle={
          'This step selects which Guardian you would like to delegate to, adding your staked ORBS tokens to their influence.'
        }
        disableInputs={disableInputs}
        contentTestId={'wizard_sub_step_initiate_guardian_selection_tx'}
        innerContent={guardianSelectionContent}
      />
    );
  },
);
