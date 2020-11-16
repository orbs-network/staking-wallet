import React, { useMemo } from 'react';
import { WizardContainer } from './WizardContainer';
import { DialogContent, DialogTitle, Grid, IconButton, Step, StepLabel } from '@material-ui/core';
import { WizardStepper } from './WizardStepper';
import styled from 'styled-components';
import CloseIcon from '@material-ui/icons/Close';

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
        {/*<div style={{ position: 'absolute', right: '0rem', top: '0px' }}>*/}
        {/*  <IconButton style={{}} onClick={() => console.log('should close')}>*/}
        {/*    <CloseIcon />*/}
        {/*  </IconButton>*/}
        {/*</div>*/}
        <WizardStepper activeStep={activeStep} alternativeLabel>
          {stepperStepTitles}
        </WizardStepper>
      </DialogTitle>
      <StyledDialogContent data-testid={dataTestId}>{content}</StyledDialogContent>
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
