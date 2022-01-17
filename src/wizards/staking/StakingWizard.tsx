import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNumber } from 'react-hanger';
import { IOrbsStakingStepContentProps, OrbsStakingStepContent } from './OrbsStakingStepContent';
import { ApprovableWizardStep } from '../approvableWizardStep/ApprovableWizardStep';
import { IOrbsAllowanceStepContentProps, OrbsAllowanceStepContent } from './OrbsAllowanceStepContent';
import { observer } from 'mobx-react';
import { GuardianSelectionStepContent, IGuardianSelectionStepContentProps } from './GuardianSelectionStepContent';
import { useOrbsAccountStore } from '../../store/storeHooks';
import { useStakingWizardTranslations, useWizardsCommonTranslations } from '../../translations/translationsHooks';
import { WizardFinishStep } from '../finishStep/WizardFinishStep';
import { useTrackModal } from '../../services/analytics/analyticsHooks';
import { MODAL_IDS } from '../../services/analytics/analyticConstants';
import { Wizard } from '../../components/wizards/Wizard';
import { fullOrbsFromWeiOrbsString } from '../../cryptoUtils/unitConverter';

const ROOT_STEPS_INDEXES = {
  selectGuardian: 0,
  allowTransfer: 1,
  stakeOrbs: 2,
  finish: 3,
};

const ALLOWANCE_APPROVED_STEPS_INDEXES = {
  selectGuardian: 0,
  stakeOrbs: 1,
  finish: 2,
};

interface IProps {
  closeWizard(): void;
}

// TODO : O.L : FUTURE : The material-ui Modal requires passing a ref, decide what to do with this ref.
// Connect to store
export const StakingWizard = observer(
  React.forwardRef<any, IProps>((props, ref) => {
    const { closeWizard } = props;

    useTrackModal(MODAL_IDS.staking);

    const wizardsCommonTranslations = useWizardsCommonTranslations();
    const stakingWizardTranslations = useStakingWizardTranslations();
    const [allowanceApproved, setAllowanceApproved] = useState(false);
    const orbsAccountStore = useOrbsAccountStore();
    const [stepIndexes, setStepIndexes] = useState<{ [key: string]: number }>(ROOT_STEPS_INDEXES);
    // Start and limit by liquid orbs
    const orbsAllowance = orbsAccountStore.stakingContractAllowance;
    const liquidOrbsAsString = fullOrbsFromWeiOrbsString(orbsAccountStore.liquidOrbs);

    // DEV_NOTE : O.L : if a user has an unused allowance it probably means that his process was cut in the middle.

    const initialStep = orbsAccountStore.hasSelectedGuardian ? stepIndexes.allowTransfer : stepIndexes.selectGuardian;
    const activeStep = useNumber(initialStep);

    useEffect(() => {
      const isApproved = Number(fullOrbsFromWeiOrbsString(orbsAllowance)) > Number(liquidOrbsAsString);

      if (isApproved) {
        setAllowanceApproved(isApproved);
        activeStep.setValue(ALLOWANCE_APPROVED_STEPS_INDEXES.stakeOrbs);
        setStepIndexes(ALLOWANCE_APPROVED_STEPS_INDEXES);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const goToSelectGuardianStep = useCallback(() => activeStep.setValue(stepIndexes.selectGuardian), [
      activeStep,
      stepIndexes.selectGuardian,
    ]);
    const goToSelectAmountStep = useCallback(() => activeStep.setValue(stepIndexes.allowTransfer), [
      activeStep,
      stepIndexes.allowTransfer,
    ]);
    const goToStakeOrbsStep = useCallback(() => activeStep.setValue(stepIndexes.stakeOrbs), [
      activeStep,
      stepIndexes.stakeOrbs,
    ]);
    const goToFinishStep = useCallback(() => {
      // DEV_NOTE : O.L : IMPORTANT : This manually reading is a dev hack to ensure the seleced guardian will be re-read.
      // TODO : ORL : Move this logic to a better place, and add event listener to the service.
      orbsAccountStore.manuallyReadAccountData();
      activeStep.setValue(stepIndexes.finish);
    }, [activeStep, orbsAccountStore, stepIndexes.finish]);

    const [stakeAmountFromApprovalStep, setStakeAmountFromApprovalStep] = useState(
      fullOrbsFromWeiOrbsString(orbsAccountStore.liquidOrbs),
    );

    // DEV_NOTE : adds the selected guardian address to allow user to press 'keep'
    const extraPropsForGuardianSelection = useMemo<IGuardianSelectionStepContentProps>(() => {
      return {
        selectedGuardianAddress: orbsAccountStore.selectedGuardianAddress,
      };
    }, [orbsAccountStore.selectedGuardianAddress]);

    const extraPropsForOrbsStaking = useMemo<IOrbsStakingStepContentProps>(() => {
      return {
        goBackToApproveStep: goToSelectAmountStep,
        stakeAmountFromApprovalStep,
        goBackToChooseGuardianStep: goToSelectGuardianStep,
      };
    }, [goToSelectAmountStep, goToSelectGuardianStep, stakeAmountFromApprovalStep]);

    const extraPropsForOrbsAllowance = useMemo<IOrbsAllowanceStepContentProps>(() => {
      return {
        goBackToChooseGuardianStep: goToSelectGuardianStep,
        setAmount: (value: string) => setStakeAmountFromApprovalStep(value),
        stakeAmountFromApprovalStep,
      };
    }, [goToSelectGuardianStep, stakeAmountFromApprovalStep]);

    const stepContent = useMemo(() => {
      switch (activeStep.value) {
        // TODO : ORL : TRANSLATIONS
        // Select a guardian
        case stepIndexes.selectGuardian:
          return (
            <ApprovableWizardStep
              transactionCreationSubStepContent={GuardianSelectionStepContent}
              displayCongratulationsSubStep={false}
              finishedActionName={stakingWizardTranslations('finishedAction_selectedGuardian')}
              moveToNextStepAction={allowanceApproved ? goToStakeOrbsStep : goToSelectAmountStep}
              moveToNextStepTitle={stakingWizardTranslations('moveToStep_stake')}
              closeWizard={closeWizard}
              propsForTransactionCreationSubStepContent={extraPropsForGuardianSelection}
              key={'guardianSelectionStep'}
            />
          );
        // Stake orbs
        case stepIndexes.allowTransfer:
          return (
            <ApprovableWizardStep
              transactionCreationSubStepContent={OrbsAllowanceStepContent}
              displayCongratulationsSubStep={false}
              finishedActionName={stakingWizardTranslations('finishedAction_approved')}
              moveToNextStepAction={goToStakeOrbsStep}
              moveToNextStepTitle={stakingWizardTranslations('moveToStep_stake')}
              closeWizard={closeWizard}
              propsForTransactionCreationSubStepContent={extraPropsForOrbsAllowance}
              key={'approvingStep'}
            />
          );
        // Stake orbs
        case stepIndexes.stakeOrbs:
          return (
            <ApprovableWizardStep
              transactionCreationSubStepContent={OrbsStakingStepContent}
              displayCongratulationsSubStep={false}
              finishedActionName={stakingWizardTranslations('finishedAction_staked')}
              moveToNextStepAction={goToFinishStep}
              moveToNextStepTitle={wizardsCommonTranslations('moveToStep_finish')}
              closeWizard={closeWizard}
              propsForTransactionCreationSubStepContent={extraPropsForOrbsStaking}
              key={'stakingStep'}
            />
          );
        case stepIndexes.finish:
          return (
            <WizardFinishStep
              finishedActionDescription={stakingWizardTranslations('afterSuccessStateExplanation')}
              onFinishClicked={closeWizard}
            />
          );
        default:
          throw new Error(`Unsupported step value of ${activeStep.value}`);
      }
    }, [
      activeStep.value,
      stepIndexes.selectGuardian,
      stepIndexes.allowTransfer,
      stepIndexes.stakeOrbs,
      stepIndexes.finish,
      stakingWizardTranslations,
      allowanceApproved,
      goToStakeOrbsStep,
      goToSelectAmountStep,
      closeWizard,
      extraPropsForGuardianSelection,
      extraPropsForOrbsAllowance,
      goToFinishStep,
      wizardsCommonTranslations,
      extraPropsForOrbsStaking,
    ]);

    const stepperTitles = useMemo(() => {
      const result = [
        stakingWizardTranslations('stepLabel_selectGuardian'),
        stakingWizardTranslations('stepLabel_approve'),
        stakingWizardTranslations('stepLabel_stake'),
        wizardsCommonTranslations('stepLabel_finish'),
      ];
      if (allowanceApproved) {
        result.splice(1, 1);
        return result;
      }
      return result;
    }, [allowanceApproved, stakingWizardTranslations, wizardsCommonTranslations]);

    return (
      <Wizard
        activeStep={activeStep.value}
        stepperTitles={stepperTitles}
        content={stepContent}
        dataTestId={'wizard_staking'}
      />
    );
  }),
);
