import React, { useCallback, useMemo } from 'react';
import { Button, Step, StepLabel, Typography } from '@material-ui/core';
import { useNumber } from 'react-hanger';
import { WizardContent } from '../../components/wizards/WizardContent';
import { WizardContainer } from '../../components/wizards/WizardContainer';
import { WizardStepper } from '../../components/wizards/WizardStepper';
import { OrbsStakingStepContent } from './OrbsStakingStepContent';
import { ApprovableWizardStep } from '../approvableWizardStep/ApprovableWizardStep';
import { OrbsAllowanceStepContent } from './OrbsAllowanceStepContent';
import { observer } from 'mobx-react';
import { GuardianSelectionStepContent } from './GuardianSelectionStepContent';

const STEPS_INDEXES = {
  allowTransfer: 0,
  stakeOrbs: 1,
  selectGuardian: 2,
  finish: 3,
};

interface IProps {
  closeWizard(): void;
}

// TODO : O.L : FUTURE : The material-ui Modal requires passing a ref, decide what to do with this ref.
// Connect to store
export const StakingWizard = observer(
  React.forwardRef<any, IProps>((props, ref) => {
    const { closeWizard } = props;

    const activeStep = useNumber(0);
    const goToStakeOrbsStep = useCallback(() => activeStep.setValue(STEPS_INDEXES.stakeOrbs), [activeStep]);
    const goToSelectGuardianStep = useCallback(() => activeStep.setValue(STEPS_INDEXES.selectGuardian), [activeStep]);
    const goToFinishStep = useCallback(() => activeStep.setValue(STEPS_INDEXES.finish), [activeStep]);

    const stepContent = useMemo(() => {
      switch (activeStep.value) {
        // Stake orbs
        case STEPS_INDEXES.allowTransfer:
          return (
            <ApprovableWizardStep
              transactionCreationSubStepContent={OrbsAllowanceStepContent}
              finishedActionName={'allowed the staking contract to use your tokens'}
              moveToNextStepAction={goToStakeOrbsStep}
              moveToNextStepTitle={'Stake your ORBs'}
              key={'approvingStep'}
            />
          );
        // Stake orbs
        case STEPS_INDEXES.stakeOrbs:
          return (
            <ApprovableWizardStep
              transactionCreationSubStepContent={OrbsStakingStepContent}
              finishedActionName={'staked your tokens'}
              moveToNextStepAction={goToSelectGuardianStep}
              moveToNextStepTitle={'Select a Guardian'}
              key={'stakingStep'}
            />
          );
        // Select a guardian
        case STEPS_INDEXES.selectGuardian:
          return (
            <ApprovableWizardStep
              transactionCreationSubStepContent={GuardianSelectionStepContent}
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
              <Typography> Your Orbs are now staked and are assigned to a guardian </Typography>
              <Button onClick={closeWizard}>Finish</Button>
            </WizardContent>
          );
        default:
          throw new Error(`Unsupported step value of ${activeStep.value}`);
      }
    }, [activeStep.value, closeWizard, goToFinishStep, goToSelectGuardianStep, goToStakeOrbsStep]);

    return (
      <WizardContainer data-testid={'wizard_staking'}>
        <WizardStepper activeStep={activeStep.value} alternativeLabel>
          <Step>
            <StepLabel>Approve usage of Orbs</StepLabel>
          </Step>

          <Step>
            <StepLabel>Stake your tokens</StepLabel>
          </Step>

          <Step>
            <StepLabel>Select a guardian</StepLabel>
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
