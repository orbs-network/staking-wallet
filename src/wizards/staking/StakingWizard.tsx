import React, { useCallback, useMemo } from 'react';
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

const STEPS_INDEXES = {
  selectGuardian: 0,
  allowTransfer: 1,
  stakeOrbs: 2,
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

    useTrackModal(MODAL_IDS.staking);

    const wizardsCommonTranslations = useWizardsCommonTranslations();
    const stakingWizardTranslations = useStakingWizardTranslations();
    const orbsAccountStore = useOrbsAccountStore();
    // DEV_NOTE : O.L : if a user has an unused allowance it probably means that his process was cut in the middle.
    const initialStep = orbsAccountStore.hasSelectedGuardian
      ? orbsAccountStore.hasUnusedAllowance
        ? STEPS_INDEXES.stakeOrbs
        : STEPS_INDEXES.allowTransfer
      : STEPS_INDEXES.selectGuardian;

    const activeStep = useNumber(initialStep);
    const goToSelectGuardianStep = useCallback(() => activeStep.setValue(STEPS_INDEXES.selectGuardian), [activeStep]);
    const goToSelectAmountStep = useCallback(() => activeStep.setValue(STEPS_INDEXES.allowTransfer), [activeStep]);
    const goToStakeOrbsStep = useCallback(() => activeStep.setValue(STEPS_INDEXES.stakeOrbs), [activeStep]);
    const goToFinishStep = useCallback(() => {
      // DEV_NOTE : O.L : IMPORTANT : This manually reading is a dev hack to ensure the seleced guardian will be re-read.
      // TODO : ORL : Move this logic to a better place, and add event listener to the service.
      orbsAccountStore.manuallyReadAccountData();
      activeStep.setValue(STEPS_INDEXES.finish);
    }, [activeStep, orbsAccountStore]);

    // DEV_NOTE : adds the selected guardian address to allow user to press 'keep'
    const extraPropsForGuardianSelection = useMemo<IGuardianSelectionStepContentProps>(() => {
      return {
        selectedGuardianAddress: orbsAccountStore.selectedGuardianAddress,
        isRegisteredGuardian: orbsAccountStore.isGuardian,
      };
    }, [orbsAccountStore.isGuardian, orbsAccountStore.selectedGuardianAddress]);

    const extraPropsForOrbsStaking = useMemo<IOrbsStakingStepContentProps>(() => {
      return {
        goBackToApproveStep: goToSelectAmountStep,
      };
    }, [goToSelectAmountStep]);

    const extraPropsForOrbsAllowance = useMemo<IOrbsAllowanceStepContentProps>(() => {
      return {
        goBackToChooseGuardianStep: goToSelectGuardianStep,
      };
    }, [goToSelectGuardianStep]);

    const stepContent = useMemo(() => {
      switch (activeStep.value) {
        // TODO : ORL : TRANSLATIONS
        // Select a guardian
        case STEPS_INDEXES.selectGuardian:
          return (
            <ApprovableWizardStep
              transactionCreationSubStepContent={GuardianSelectionStepContent}
              displayCongratulationsSubStep={false}
              finishedActionName={stakingWizardTranslations('finishedAction_selectedGuardian')}
              moveToNextStepAction={goToSelectAmountStep}
              moveToNextStepTitle={stakingWizardTranslations('moveToStep_stake')}
              closeWizard={closeWizard}
              propsForTransactionCreationSubStepContent={extraPropsForGuardianSelection}
              key={'guardianSelectionStep'}
            />
          );
        // Stake orbs
        case STEPS_INDEXES.allowTransfer:
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
        case STEPS_INDEXES.stakeOrbs:
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
        case STEPS_INDEXES.finish:
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
      closeWizard,
      extraPropsForGuardianSelection,
      extraPropsForOrbsAllowance,
      extraPropsForOrbsStaking,
      goToFinishStep,
      goToSelectAmountStep,
      goToStakeOrbsStep,
      stakingWizardTranslations,
      wizardsCommonTranslations,
    ]);

    const stepperTitles = useMemo(() => {
      return [
        stakingWizardTranslations('stepLabel_selectGuardian'),
        stakingWizardTranslations('stepLabel_approve'),
        stakingWizardTranslations('stepLabel_stake'),
        wizardsCommonTranslations('stepLabel_finish'),
      ];
    }, [stakingWizardTranslations, wizardsCommonTranslations]);

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
