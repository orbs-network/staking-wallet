import React, { useCallback, useMemo } from 'react';
import { Button, Step, StepLabel, Typography } from '@material-ui/core';
import { useNumber } from 'react-hanger';
import { WizardContent } from '../../components/wizards/WizardContent';
import { WizardContainer } from '../../components/wizards/WizardContainer';
import { WizardStepper } from '../../components/wizards/WizardStepper';
import { ApprovableWizardStep } from '../approvableWizardStep/ApprovableWizardStep';
import { observer } from 'mobx-react';
import { OrbsWithdrawingStepContent } from './OrbsWithdrawingStepContent';

const STEPS_INDEXES = {
  withdrawOrbs: 0,
  finish: 1,
};

interface IProps {
  closeWizard(): void;
}

// TODO : O.L : FUTURE : The material-ui Modal requires passing a ref, decide what to do with this ref.
// Connect to store
export const WithdrawingWizard = observer(
  React.forwardRef<any, IProps>((props, ref) => {
    const { closeWizard } = props;

    const activeStep = useNumber(0);
    const goToFinishStep = useCallback(() => activeStep.setValue(STEPS_INDEXES.finish), [activeStep]);

    const stepContent = useMemo(() => {
      switch (activeStep.value) {
        // Un-Stake orbs
        case STEPS_INDEXES.withdrawOrbs:
          return (
            <ApprovableWizardStep
              transactionCreationSubStepContent={OrbsWithdrawingStepContent}
              finishedActionName={'selected a guardian'}
              moveToNextStepAction={goToFinishStep}
              moveToNextStepTitle={'Finish'}
              key={'guardianSelectionStep'}
            />
          );
        case STEPS_INDEXES.finish:
          return (
            <WizardContent data-testid={'wizard_sub_step_finish'}>
              <Typography>Awesome !</Typography>
              <Typography> Your unstaked Orbs will be available after the unfreezing period </Typography>
              <Button onClick={closeWizard}>Finish</Button>
            </WizardContent>
          );
        default:
          throw new Error(`Unsupported step value of ${activeStep.value}`);
      }
    }, [activeStep.value, closeWizard, goToFinishStep]);

    return (
      <WizardContainer data-testid={'wizard_withdrawing'}>
        <WizardStepper activeStep={activeStep.value} alternativeLabel>
          <Step>
            <StepLabel>Withdraw Orbs</StepLabel>
          </Step>

          <Step>
            <StepLabel>Finish</StepLabel>
          </Step>
        </WizardStepper>

        {stepContent}
      </WizardContainer>
    );
  }),
);
