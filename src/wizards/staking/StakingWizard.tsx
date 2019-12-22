import React from 'react';
import { Step, StepLabel, Stepper } from '@material-ui/core';
import { useNumber } from 'react-hanger';
import styled from 'styled-components';

const StyledStepper = styled(Stepper)(styledProps => ({
  backgroundColor: 'rgba(0, 0, 0, 0)',
}));

export const StakingWizard: React.FC = () => {
  const activeStep = useNumber(0);

  return (
    <div>
      <StyledStepper activeStep={activeStep.value} alternativeLabel>
        <Step>
          <StepLabel>Staking your tokens</StepLabel>
        </Step>

        <Step>
          <StepLabel>Approving your transaction</StepLabel>
        </Step>

        <Step>
          <StepLabel>Success staking orbs</StepLabel>
        </Step>

        <Step>
          <StepLabel>Select a guardian</StepLabel>
        </Step>

        <Step>
          <StepLabel>Approving your transaction</StepLabel>
        </Step>

        <Step>
          <StepLabel>Success selecting guardian</StepLabel>
        </Step>
      </StyledStepper>
    </div>
  );
};
