import React, { useCallback, useMemo } from 'react';
import { useNumber } from 'react-hanger';
import { ApprovableWizardStep } from '../approvableWizardStep/ApprovableWizardStep';
import { observer } from 'mobx-react';
import { RewardsCalaimingStepContent } from './RewardsCalaimingStepContent';
import {
  useRewardsClaimingWizardTranslations,
  useWizardsCommonTranslations,
} from '../../translations/translationsHooks';
import { WizardFinishStep } from '../finishStep/WizardFinishStep';
import { useTrackModal } from '../../services/analytics/analyticsHooks';
import { MODAL_IDS } from '../../services/analytics/analyticConstants';
import { Wizard } from '../../components/wizards/Wizard';

const STEPS_INDEXES = {
  claimRewards: 0,
  finish: 1,
};

interface IProps {
  closeWizard(): void;
}

// TODO : O.L : FUTURE : The material-ui Modal requires passing a ref, decide what to do with this ref.
export const RewardsClaimingWizard = observer(
  React.forwardRef<any, IProps>((props, ref) => {
    useTrackModal(MODAL_IDS.rewardsClaiming);
    const { closeWizard } = props;

    const wizardsCommonTranslations = useWizardsCommonTranslations();
    const rewardsClaimingWizardTranslations = useRewardsClaimingWizardTranslations();
    const activeStep = useNumber(STEPS_INDEXES.claimRewards);
    const goToFinishStep = useCallback(() => activeStep.setValue(STEPS_INDEXES.finish), [activeStep]);

    const stepContent = useMemo(() => {
      switch (activeStep.value) {
        // Select a guardian
        case STEPS_INDEXES.claimRewards:
          return (
            <ApprovableWizardStep
              transactionCreationSubStepContent={RewardsCalaimingStepContent}
              displayCongratulationsSubStep={false}
              finishedActionName={rewardsClaimingWizardTranslations('finishedAction_claim')}
              moveToNextStepAction={goToFinishStep}
              moveToNextStepTitle={wizardsCommonTranslations('moveToStep_finish')}
              key={'rewardsClaimingStep'}
              closeWizard={closeWizard}
            />
          );
        case STEPS_INDEXES.finish:
          return (
            <WizardFinishStep
              finishedActionDescription={rewardsClaimingWizardTranslations('afterSuccessStateExplanation')}
              onFinishClicked={closeWizard}
            />
          );
        default:
          throw new Error(`Unsupported step value of ${activeStep.value}`);
      }
    }, [activeStep.value, closeWizard, goToFinishStep, rewardsClaimingWizardTranslations, wizardsCommonTranslations]);

    const stepperTitles = useMemo(() => {
      return [rewardsClaimingWizardTranslations('stepLabel_claim'), wizardsCommonTranslations('stepLabel_finish')];
    }, [rewardsClaimingWizardTranslations, wizardsCommonTranslations]);

    return (
      <Wizard
        activeStep={activeStep.value}
        stepperTitles={stepperTitles}
        content={stepContent}
        dataTestId={'wizard_guardianChanging'}
      />
    );
  }),
);
