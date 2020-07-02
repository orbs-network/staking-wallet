import React, { useMemo } from 'react';
import { WizardContainer } from './WizardContainer';
import { DialogContent, DialogTitle, Grid, Step, StepLabel } from '@material-ui/core';
import { WizardStepper } from './WizardStepper';
import styled from 'styled-components';

interface IProps {
  stepperTitles: string[];
  activeStep: number;
  content: JSX.Element;

  // For tests
  dataTestId?: string;
}

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  maxHeight: '100%',
  height: 'auto',

  [theme.breakpoints.down('xs')]: {
    paddingRight: 0,
    paddingLeft: 0,

    // Reduces height
    paddingTop: 0,
    paddingBottom: 0,
  },
}));

export const Wizard = React.memo<IProps>((props) => {
  const { activeStep, stepperTitles, content, dataTestId } = props;

  const stepperStepTitles = useMemo(() => {
    return stepperTitles.map((title) => (
      <Step key={title}>
        <StepLabel>{title}</StepLabel>
      </Step>
    ));
  }, [stepperTitles]);

  return (
    <>
      <DialogTitle>
        <WizardStepper activeStep={activeStep} alternativeLabel>
          {stepperStepTitles}
        </WizardStepper>
      </DialogTitle>
      <StyledDialogContent data-testid={dataTestId}>
        {content}
      </StyledDialogContent>
    </>
    // <StyledDialogContent data-testid={dataTestId}>
    //   <WizardContainer>
    //     <Grid item container direction={'column'} alignItems={'center'}>
    //       <WizardStepper activeStep={activeStep} alternativeLabel>
    //         {stepperStepTitles}
    //       </WizardStepper>
    //     </Grid>
    //     <Grid item container direction={'column'} alignItems={'center'}>
    //       {content}
    //     </Grid>
    //   </WizardContainer>
    // </StyledDialogContent>
  );
});
