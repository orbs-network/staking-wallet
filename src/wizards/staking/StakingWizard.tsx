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
import { GuardianSelectionStepContent, IGuardianSelectionStepContentProps } from './GuardianSelectionStepContent';
import { useOrbsAccountStore } from '../../store/storeHooks';
import { useStakingWizardTranslations, useWizardsCommonTranslations } from '../../translations/translationsHooks';

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

    const wizardsCommonTranslations = useWizardsCommonTranslations();
    const stakingWizardTranslations = useStakingWizardTranslations();
    const orbsAccountStore = useOrbsAccountStore();
    const activeStep = useNumber(0);
    const goToStakeOrbsStep = useCallback(() => activeStep.setValue(STEPS_INDEXES.stakeOrbs), [activeStep]);
    const goToSelectGuardianStep = useCallback(() => activeStep.setValue(STEPS_INDEXES.selectGuardian), [activeStep]);
    const goToFinishStep = useCallback(() => activeStep.setValue(STEPS_INDEXES.finish), [activeStep]);

    const extraPropsForGuardianSelection = useMemo<IGuardianSelectionStepContentProps>(() => {
      return {
        selectedGuardianAddress: orbsAccountStore.selectedGuardianAddress,
      };
    }, [orbsAccountStore.selectedGuardianAddress]);

    const stepContent = useMemo(() => {
      switch (activeStep.value) {
        // Stake orbs
        case STEPS_INDEXES.allowTransfer:
          return (
            <ApprovableWizardStep
              transactionCreationSubStepContent={OrbsAllowanceStepContent}
              finishedActionName={stakingWizardTranslations('finishedAction_approved')}
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
              finishedActionName={stakingWizardTranslations('finishedAction_staked')}
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
              finishedActionName={stakingWizardTranslations('stepLabel_selectGuardian')}
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
              <Typography>{stakingWizardTranslations('afterSuccessStateExplanation')}</Typography>
              <Button onClick={closeWizard}>{wizardsCommonTranslations('stepLabel_finish')}</Button>
            </WizardContent>
          );
        default:
          throw new Error(`Unsupported step value of ${activeStep.value}`);
      }
    }, [
      activeStep.value,
      closeWizard,
      extraPropsForGuardianSelection,
      goToFinishStep,
      goToSelectGuardianStep,
      goToStakeOrbsStep,
      stakingWizardTranslations,
      wizardsCommonTranslations,
    ]);

    return (
      <WizardContainer data-testid={'wizard_staking'}>
        <WizardStepper activeStep={activeStep.value} alternativeLabel>
          <Step>
            <StepLabel>{stakingWizardTranslations('stepLabel_approve')}</StepLabel>
          </Step>

          <Step>
            <StepLabel>{stakingWizardTranslations('stepLabel_stake')}</StepLabel>
          </Step>

          <Step>
            <StepLabel>{stakingWizardTranslations('stepLabel_selectGuardian')}</StepLabel>
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
