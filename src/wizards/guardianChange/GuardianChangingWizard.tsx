import React, { useCallback, useMemo } from 'react';
import { useNumber } from 'react-hanger';
import { ApprovableWizardStep } from '../approvableWizardStep/ApprovableWizardStep';
import { observer } from 'mobx-react';
import { GuardianChangeStepContent, IGuardianChangeStepContentProps } from './GuardianChangeStepContent';
import {
  useGuardianChangingWizardTranslations,
  useWizardsCommonTranslations,
} from '../../translations/translationsHooks';
import { WizardFinishStep } from '../finishStep/WizardFinishStep';
import { useTrackModal } from '../../services/analytics/analyticsHooks';
import { MODAL_IDS } from '../../services/analytics/analyticConstants';
import { Wizard } from '../../components/wizards/Wizard';

const STEPS_INDEXES = {
  selectGuardian: 0,
  finish: 1,
};

interface IProps {
  closeWizard(): void;
  newGuardianAddress: string;
}

// TODO : O.L : FUTURE : The material-ui Modal requires passing a ref, decide what to do with this ref.
// Connect to store
export const GuardianChangingWizard = observer(
  React.forwardRef<any, IProps>((props, ref) => {
    useTrackModal(MODAL_IDS.guardianChange);
    const { closeWizard, newGuardianAddress } = props;

    const wizardsCommonTranslations = useWizardsCommonTranslations();
    const guardianChangingWizardTranslations = useGuardianChangingWizardTranslations();
    const activeStep = useNumber(0);
    const goToFinishStep = useCallback(() => activeStep.setValue(STEPS_INDEXES.finish), [activeStep]);

    const extraPropsForGuardianSelection = useMemo<IGuardianChangeStepContentProps>(() => {
      return {
        newGuardianAddress,
      };
    }, [newGuardianAddress]);

    const stepContent = useMemo(() => {
      switch (activeStep.value) {
        // Select a guardian
        case STEPS_INDEXES.selectGuardian:
          return (
            <ApprovableWizardStep
              transactionCreationSubStepContent={GuardianChangeStepContent}
              displayCongratulationsSubStep={false}
              finishedActionName={guardianChangingWizardTranslations('finishedAction_selectedGuardian')}
              moveToNextStepAction={goToFinishStep}
              moveToNextStepTitle={wizardsCommonTranslations('moveToStep_finish')}
              key={'guardianSelectionStep'}
              propsForTransactionCreationSubStepContent={extraPropsForGuardianSelection}
              closeWizard={closeWizard}
            />
          );
        case STEPS_INDEXES.finish:
          return (
            <WizardFinishStep
              finishedActionDescription={guardianChangingWizardTranslations('afterSuccessStateExplanation')}
              onFinishClicked={closeWizard}
            />
          );
        default:
          throw new Error(`Unsupported step value of ${activeStep.value}`);
      }
    }, [
      activeStep.value,
      closeWizard,
      extraPropsForGuardianSelection,
      goToFinishStep,
      guardianChangingWizardTranslations,
      wizardsCommonTranslations,
    ]);

    const stepperTitles = useMemo(() => {
      return [
        guardianChangingWizardTranslations('stepLabel_changeGuardian'),
        wizardsCommonTranslations('stepLabel_finish'),
      ];
    }, [guardianChangingWizardTranslations, wizardsCommonTranslations]);

    return (
      <Wizard
        activeStep={activeStep.value}
        stepperTitles={stepperTitles}
        content={stepContent}
        dataTestId={'wizard_guardianChanging'}
      />
    );
  }),
);
