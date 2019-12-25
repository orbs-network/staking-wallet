import React, { useCallback } from 'react';
import {
  Button,
  Input,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core';
import { useNumber } from 'react-hanger';
import styled from 'styled-components';
import { useOrbsAccountStore } from '../../store/storeHooks';

const StyledStepper = styled(Stepper)(styledProps => ({
  backgroundColor: 'rgba(0, 0, 0, 0)',
}));

export const StakingWizard: React.FC = () => {
  const orbsAccountStore = useOrbsAccountStore();
  const orbsForStaking = useNumber(parseInt(orbsAccountStore.liquidOrbs)); // Start with the maximum amount

  const activeStep = useNumber(0);
  const goToNextStep = () => activeStep.increase();

  const stakeTokens = useCallback(async () => {
    try {
      const { txVerificationListener } = await orbsAccountStore.stakeOrbs(orbsForStaking.value);

      activeStep.increase();
    } catch (e) {
      console.error(e);
    }
  }, [orbsAccountStore, activeStep, orbsForStaking]);

  return (
    <div data-testid={'wizard_staking'}>
      <StyledStepper activeStep={activeStep.value} alternativeLabel>
        <Step>
          <StepLabel>Staking your tokens</StepLabel>

          <StepContent data-testid={'wizard_step_select_amount_for_stake'}>
            <Typography>Staking your tokens in the smart contract</Typography>
            {/* TODO : O.L : Add a number formatter here to dispaly the sums with proper separation */}
            <Input
              type={'number'}
              value={orbsForStaking.value}
              onChange={e => orbsForStaking.setValue(parseInt(e.target.value))}
              inputProps={{ 'data-testid': 'orbs_amount_for_staking' }}
            />
            <Button onClick={stakeTokens}>STAKE</Button>
          </StepContent>
        </Step>

        <Step>
          <StepLabel>Approving your transaction</StepLabel>

          <StepContent data-testid={'wizard_step_wait_for_staking_confirmation'}>
            <Typography>Approving your transaction</Typography>
            <div data-testid={'transaction_pending_indicator'}>

            </div>
            <Typography>
              Link to{' '}
              <a href={'https://etherscan.com'} target={'_blank'} rel={'noopener noreferrer'}>
                Ether Scan
              </a>{' '}
            </Typography>
            <Typography variant={'caption'}>Wait a few seconds... </Typography>
            <Button onClick={goToNextStep}>Proceed</Button>
          </StepContent>
        </Step>

        <Step>
          <StepLabel>Success staking orbs</StepLabel>

          <StepContent>
            <Typography>Congratulations</Typography>
            <Typography>You have successfully staked Yamba orbs </Typography>
            <Button onClick={goToNextStep}>Select a Guardian</Button>
          </StepContent>
        </Step>

        <Step>
          <StepLabel>Select a guardian</StepLabel>

          <StepContent>
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
          </StepContent>
        </Step>

        <Step>
          <StepLabel>Approving your transaction</StepLabel>

          <StepContent>
            <Typography>Approving your transaction</Typography>
            <Typography>
              Link to{' '}
              <a href={'https://etherscan.com'} target={'_blank'} rel={'noopener noreferrer'}>
                Ether Scan
              </a>{' '}
            </Typography>
            <Typography variant={'caption'}>Wait a few seconds... </Typography>
            <Button onClick={goToNextStep}>Proceed</Button>
          </StepContent>
        </Step>

        <Step>
          <StepLabel>Success selecting guardian</StepLabel>

          <StepContent>
            <Typography>Congratulations</Typography>
            <Typography>You have successfully selected a guardian </Typography>
            <Button onClick={() => null}>Finish</Button>
          </StepContent>
        </Step>
      </StyledStepper>
    </div>
  );
};
