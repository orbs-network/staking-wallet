import React, { useCallback, useMemo } from 'react';
import { Step, StepLabel } from '@material-ui/core';
import { useNumber } from 'react-hanger';
import { WizardContainer } from '../../components/wizards/WizardContainer';
import { WizardStepper } from '../../components/wizards/WizardStepper';
import { ApprovableWizardStep } from '../approvableWizardStep/ApprovableWizardStep';
import { observer } from 'mobx-react';
import { OrbsUntakingStepContent } from './OrbsUnstakingStepContent';
import { useUnstakingWizardTranslations, useWizardsCommonTranslations } from '../../translations/translationsHooks';
import { WizardFinishStep } from '../finishStep/WizardFinishStep';

const STEPS_INDEXES = {
  unstakeOrbs: 0,
  finish: 1,
};

interface IProps {
  closeWizard(): void;
}

// TODO : O.L : FUTURE : The material-ui Modal requires passing a ref, decide what to do with this ref.
// Connect to store
export const UnstakingWizard = observer(
  React.forwardRef<any, IProps>((props, ref) => {
    const { closeWizard } = props;

    const wizardsCommonTranslations = useWizardsCommonTranslations();
    const unstakingWizardTranslations = useUnstakingWizardTranslations();
    const activeStep = useNumber(0);
    const goToFinishStep = useCallback(() => activeStep.setValue(STEPS_INDEXES.finish), [activeStep]);

    const stepContent = useMemo(() => {
      switch (activeStep.value) {
        // Un-Stake orbs
        case STEPS_INDEXES.unstakeOrbs:
          return (
            <ApprovableWizardStep
              transactionCreationSubStepContent={OrbsUntakingStepContent}
              finishedActionName={unstakingWizardTranslations('finishedAction_unstaked')}
              moveToNextStepAction={goToFinishStep}
              moveToNextStepTitle={wizardsCommonTranslations('moveToStep_finish')}
              key={'guardianSelectionStep'}
              closeWizard={closeWizard}
            />
          );
        case STEPS_INDEXES.finish:
          return (
            <WizardFinishStep
              finishedActionDescription={unstakingWizardTranslations('afterSuccessStateExplanation')}
              onFinishClicked={closeWizard}
            />
          );
        default:
          throw new Error(`Unsupported step value of ${activeStep.value}`);
      }
    }, [activeStep.value, closeWizard, goToFinishStep, unstakingWizardTranslations, wizardsCommonTranslations]);

    return (
      <WizardContainer data-testid={'wizard_unstaking'}>
        <WizardStepper activeStep={activeStep.value} alternativeLabel>
          <Step>
            <StepLabel>{unstakingWizardTranslations('stepLabel_unstake')}</StepLabel>
          </Step>

          <Step>
            <StepLabel>{wizardsCommonTranslations('stepLabel_finish')}</StepLabel>
          </Step>
        </WizardStepper>

        {stepContent}
      </WizardContainer>
    );
  }),
);
