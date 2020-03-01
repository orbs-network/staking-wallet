import React, { useCallback, useMemo } from 'react';
import { Button, Step, StepLabel, Typography } from '@material-ui/core';
import { useNumber } from 'react-hanger';
import { WizardContent } from '../../components/wizards/WizardContent';
import { WizardContainer } from '../../components/wizards/WizardContainer';
import { WizardStepper } from '../../components/wizards/WizardStepper';
import { ApprovableWizardStep } from '../approvableWizardStep/ApprovableWizardStep';
import { observer } from 'mobx-react';
import { GuardianChangeStepContent, IGuardianChangeStepContentProps } from './GuardianChangeStepContent';
import {
  useGuardianChangingWizardTranslations,
  useWizardsCommonTranslations,
} from '../../translations/translationsHooks';

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
              finishedActionName={'selected a guardian'}
              moveToNextStepAction={goToFinishStep}
              moveToNextStepTitle={'Finish'}
              key={'guardianSelectionStep'}
              propsForTransactionCreationSubStepContent={extraPropsForGuardianSelection}
            />
          );
        case STEPS_INDEXES.finish:
          return (
            <WizardContent data-testid={'wizard_sub_step_finish'}>
              <Typography>{wizardsCommonTranslations('stepDoneExclamation')}</Typography>
              <Typography> You have selected a new guardian </Typography>
              <Button onClick={closeWizard}>Finish</Button>
            </WizardContent>
          );
        default:
          throw new Error(`Unsupported step value of ${activeStep.value}`);
      }
    }, [activeStep.value, closeWizard, extraPropsForGuardianSelection, goToFinishStep]);

    return (
      <WizardContainer data-testid={'wizard_staking'}>
        <WizardStepper activeStep={activeStep.value} alternativeLabel>
          <Step>
            <StepLabel>{guardianChangingWizardTranslations('stepLabel_changeGuardian')}</StepLabel>
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
