import React, { useCallback, useEffect, useMemo } from 'react';
import { useStateful } from 'react-hanger';
import { useGuardiansStore } from '../../store/storeHooks';
import { ITransactionCreationStepProps } from '../approvableWizardStep/ApprovableWizardStep';
import { observer } from 'mobx-react';
import { GuardiansTable } from '../../components/GuardiansTable';
import { TGuardianInfoExtended } from '../../store/GuardiansStore';
import { messageFromTxCreationSubStepError } from '../wizardMessages';
import { BaseStepContent } from '../approvableWizardStep/BaseStepContent';
import { useStakingWizardTranslations, useWizardsCommonTranslations } from '../../translations/translationsHooks';
import { Grid } from '@material-ui/core';

export interface IGuardianSelectionStepContentProps {
  selectedGuardianAddress: string;
}

export const GuardianSelectionStepContent = observer(
  (props: ITransactionCreationStepProps & IGuardianSelectionStepContentProps) => {
    const { onPromiEventAction, skipToSuccess, txError, disableInputs, selectedGuardianAddress } = props;

    const wizardsCommonTranslations = useWizardsCommonTranslations();
    const stakingWizardTranslations = useStakingWizardTranslations();
    const guardiansStore = useGuardiansStore();

    // Start and limit by allowance
    const message = useStateful(stakingWizardTranslations('guardianSelectionSubStep_message_selectGuardian'));
    const subMessage = useStateful(
      stakingWizardTranslations('guardianSelectionSubStep_subMessage_pressSelectAndApprove'),
    );

    // Display the proper error message
    useEffect(() => {
      if (txError) {
        const { errorMessage, errorSubMessage } = messageFromTxCreationSubStepError(txError, wizardsCommonTranslations);
        message.setValue(errorMessage);
        subMessage.setValue(errorSubMessage);
      }
    }, [txError, message, subMessage, wizardsCommonTranslations]);

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
        <Grid item style={{ marginLeft: '1em', marginRight: '1em' }}>
          <GuardiansTable
            guardians={guardiansStore.guardiansList}
            guardianSelectionMode={'Select'}
            onGuardianSelect={selectGuardian}
            selectedGuardian={selectedGuardianAddress}
            tableTestId={'guardian_selection_sub_step_guardians_table'}
            // extraStyle={{ marginLeft: '1em', marginRight: '1em' }}
          />
        </Grid>
      );
    }, [guardiansStore.guardiansList, selectGuardian, selectedGuardianAddress]);

    return (
      <BaseStepContent
        message={message.value}
        subMessage={subMessage.value}
        title={stakingWizardTranslations('guardianSelectionSubStep_stepTitle')}
        infoTitle={stakingWizardTranslations('guardianSelectionSubStep_stepExplanation')}
        disableInputs={disableInputs}
        contentTestId={'wizard_sub_step_initiate_guardian_selection_tx'}
        innerContent={guardianSelectionContent}
      />
    );
  },
);
