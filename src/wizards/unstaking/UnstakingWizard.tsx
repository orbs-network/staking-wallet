import React, { useCallback, useMemo } from 'react';
import { useNumber } from 'react-hanger';
import { ApprovableWizardStep } from '../approvableWizardStep/ApprovableWizardStep';
import { observer } from 'mobx-react';
import { OrbsUntakingStepContent } from './OrbsUnstakingStepContent';
import {
  useRewardsClaimingWizardTranslations,
  useUnstakingWizardTranslations,
  useWizardsCommonTranslations,
} from '../../translations/translationsHooks';
import { WizardFinishStep } from '../finishStep/WizardFinishStep';
import { useTrackModal } from '../../services/analytics/analyticsHooks';
import { MODAL_IDS } from '../../services/analytics/analyticConstants';
import { Wizard } from '../../components/wizards/Wizard';
import {
  IRewardsClaimingStepContentProps,
  RewardsCalaimingStepContent,
} from '../rewardsClaiming/RewardsCalaimingStepContent';
import { useOrbsAccountStore } from '../../store/storeHooks';

const STEPS_INDEXES = {
  claimRewards: 0,
  unstakeOrbs: 1,
  finish: 2,
};

interface IProps {
  closeWizard(): void;
}

// TODO : O.L : FUTURE : The material-ui Modal requires passing a ref, decide what to do with this ref.
// Connect to store
export const UnstakingWizard = observer(
  React.forwardRef<any, IProps>((props, ref) => {
    useTrackModal(MODAL_IDS.unstaking);
    const { closeWizard } = props;

    const orbsAccountStore = useOrbsAccountStore();

    const wizardsCommonTranslations = useWizardsCommonTranslations();
    const unstakingWizardTranslations = useUnstakingWizardTranslations();
    const rewardsClaimingWizardTranslations = useRewardsClaimingWizardTranslations();
    const activeStep = useNumber(
      orbsAccountStore.hasClaimableRewards ? STEPS_INDEXES.claimRewards : STEPS_INDEXES.unstakeOrbs,
    );
    const goToUnstakeStep = useCallback(() => activeStep.setValue(STEPS_INDEXES.unstakeOrbs), [activeStep]);
    const goToFinishStep = useCallback(() => activeStep.setValue(STEPS_INDEXES.finish), [activeStep]);

    // TODO : ORL : TRANSLATIONS

    const extraStepsForRewardsClaiming = useMemo<IRewardsClaimingStepContentProps>(() => {
      const stepProps: IRewardsClaimingStepContentProps = {
        shouldAddSkip: true,
        skipToNextStep: goToUnstakeStep,
      };

      return stepProps;
    }, [goToUnstakeStep]);

    const stepContent = useMemo(() => {
      switch (activeStep.value) {
        // Un-Stake orbs
        case STEPS_INDEXES.claimRewards:
          return (
            <ApprovableWizardStep
              transactionCreationSubStepContent={RewardsCalaimingStepContent}
              propsForTransactionCreationSubStepContent={extraStepsForRewardsClaiming}
              displayCongratulationsSubStep={false}
              finishedActionName={rewardsClaimingWizardTranslations('finishedAction_claim')}
              moveToNextStepAction={goToFinishStep}
              moveToNextStepTitle={wizardsCommonTranslations('moveToStep_finish')}
              key={'rewardsClaimingStep'}
              closeWizard={closeWizard}
            />
          );
        // Un-Stake orbs
        case STEPS_INDEXES.unstakeOrbs:
          return (
            <ApprovableWizardStep
              transactionCreationSubStepContent={OrbsUntakingStepContent}
              displayCongratulationsSubStep={false}
              finishedActionName={unstakingWizardTranslations('finishedAction_unstaked')}
              moveToNextStepAction={goToFinishStep}
              moveToNextStepTitle={wizardsCommonTranslations('moveToStep_finish')}
              key={'guardianSelectionStep'}
              closeWizard={closeWizard}
            />
          );
        case STEPS_INDEXES.finish:
          return (
            <WizardFinishStep
              finishedActionDescription={unstakingWizardTranslations('afterSuccessStateExplanation')}
              onFinishClicked={closeWizard}
            />
          );
        default:
          throw new Error(`Unsupported step value of ${activeStep.value}`);
      }
    }, [
      activeStep.value,
      closeWizard,
      goToFinishStep,
      rewardsClaimingWizardTranslations,
      unstakingWizardTranslations,
      wizardsCommonTranslations,
    ]);

    const stepperTitles = useMemo(() => {
      return [
        rewardsClaimingWizardTranslations('stepLabel_claim'),
        unstakingWizardTranslations('stepLabel_unstake'),
        wizardsCommonTranslations('stepLabel_finish'),
      ];
    }, [rewardsClaimingWizardTranslations, unstakingWizardTranslations, wizardsCommonTranslations]);

    return (
      <Wizard
        activeStep={activeStep.value}
        stepperTitles={stepperTitles}
        content={stepContent}
        dataTestId={'wizard_unstaking'}
      />
    );
  }),
);
