import React, { useCallback, useMemo } from 'react';
import {
  Button,
  Step,
  StepLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core';
import { useNumber } from 'react-hanger';
import { WizardContent } from '../../components/wizards/WizardContent';
import { WizardContainer } from '../../components/wizards/WizardContainer';
import { WizardStepper } from '../../components/wizards/WizardStepper';
import { OrbsStakingStepContent } from './OrbsStakingStepContent';
import { useOrbsAccountStore } from '../../store/storeHooks';
import { ApprovableWizardStep } from '../approvableWizardStep/ApprovableWizardStep';
import { OrbsAllowanceStepContent } from './OrbsAllowanceStepContent';
import { observer } from 'mobx-react';

const STEPS_INDEXES = {
  allowTransfer: 0,
  stakeOrbs: 1,
  selectGuardian: 2,
  finish: 3,
};

interface IProps {
  closeWizard(): void;
}

// Connect to store
export const StakingWizard = observer((props: IProps) => {
  const { closeWizard } = props;

  const orbsAccountStore = useOrbsAccountStore();

  const activeStep = useNumber(0);
  const goToNextStep = useCallback(() => activeStep.increase(), [activeStep]);
  const goToStakeOrbsStep = useCallback(() => activeStep.setValue(STEPS_INDEXES.stakeOrbs), [activeStep]);
  const goToSelectGuardianStep = useCallback(() => activeStep.setValue(STEPS_INDEXES.selectGuardian), [activeStep]);

  const createAllowOrbsTx = useCallback((amount: number) => orbsAccountStore.setOrbsAllowance(amount), [
    orbsAccountStore,
  ]);
  const createStakeOrbsTx = useCallback((amount: number) => orbsAccountStore.stakeOrbs(amount), [orbsAccountStore]);

  const stepContent = useMemo(() => {
    switch (activeStep.value) {
      // Stake orbs
      case STEPS_INDEXES.allowTransfer:
        return (
          <ApprovableWizardStep<number>
            txCreatingAction={createAllowOrbsTx}
            transactionCreationSubStepContent={OrbsAllowanceStepContent}
            moveToNextStepAction={goToStakeOrbsStep}
            moveToNextStepTitle={'Stake your ORBs'}
            key={'approvingStep'}
          />
        );
      // Stake orbs
      case STEPS_INDEXES.stakeOrbs:
        return (
          <ApprovableWizardStep<number>
            txCreatingAction={createStakeOrbsTx}
            transactionCreationSubStepContent={OrbsStakingStepContent}
            moveToNextStepAction={goToSelectGuardianStep}
            moveToNextStepTitle={'Select a Guardian'}
            key={'stakingStep'}
          />
        );
      // Select a guardian
      case STEPS_INDEXES.selectGuardian:
        return (
          <WizardContent>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Rank</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Address</TableCell>
                    <TableCell>Selection</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {/* Demo row 1 */}
                  <TableRow>
                    <TableCell>1</TableCell>
                    <TableCell>Douglas Meshuga</TableCell>
                    <TableCell>0xff45223cb</TableCell>
                    <TableCell>
                      <Button onClick={goToNextStep}>Select</Button>
                    </TableCell>
                  </TableRow>

                  {/* Demo row 2 */}
                  <TableRow>
                    <TableCell>2</TableCell>
                    <TableCell>Marina Aliasi</TableCell>
                    <TableCell>0x0343feab</TableCell>
                    <TableCell>
                      <Button onClick={goToNextStep}>Select</Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </WizardContent>
        );
      case STEPS_INDEXES.finish:
        return (
          <WizardContent>
            <Typography>Awesome !</Typography>
            <Typography> Your Orbs are now staked and are assigned to a guardian </Typography>
            <Button onClick={closeWizard}>Finish</Button>
          </WizardContent>
        );
      default:
        throw new Error(`Unsupported step value of ${activeStep.value}`);
    }
  }, [
    activeStep.value,
    closeWizard,
    createAllowOrbsTx,
    createStakeOrbsTx,
    goToNextStep,
    goToSelectGuardianStep,
    goToStakeOrbsStep,
  ]);

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
});
