import React, { useCallback, useMemo } from 'react';
import { Grid, Step, StepLabel } from '@material-ui/core';
import { useNumber } from 'react-hanger';
import { WizardContainer } from '../../components/wizards/WizardContainer';
import { WizardStepper } from '../../components/wizards/WizardStepper';
import { ApprovableWizardStep } from '../approvableWizardStep/ApprovableWizardStep';
import { observer } from 'mobx-react';
import {
  useGuardianChangingWizardTranslations,
  useGuardianSelectingWizardTranslations,
  useStakingWizardTranslations,
  useWizardsCommonTranslations,
} from '../../translations/translationsHooks';
import { WizardFinishStep } from '../finishStep/WizardFinishStep';
import { useTrackModal } from '../../services/analytics/analyticsHooks';
import { MODAL_IDS } from '../../services/analytics/analyticConstants';
import {
  GuardianSelectionStepContent,
  IGuardianSelectionStepContentProps,
} from '../staking/GuardianSelectionStepContent';

const STEPS_INDEXES = {
  selectGuardian: 0,
  finish: 1,
};

interface IProps {
  closeWizard(): void;
  selectedGuardianAddress: string;
}

// TODO : O.L : FUTURE : The material-ui Modal requires passing a ref, decide what to do with this ref.
// Connect to store
export const GuardianSelectingWizard = observer(
  React.forwardRef<any, IProps>((props, ref) => {
    useTrackModal(MODAL_IDS.guardianSelection);
    const { closeWizard, selectedGuardianAddress } = props;

    const wizardsCommonTranslations = useWizardsCommonTranslations();
    const guardianSelectingWizardTranslations = useGuardianSelectingWizardTranslations();
    const activeStep = useNumber(0);
    const goToFinishStep = useCallback(() => activeStep.setValue(STEPS_INDEXES.finish), [activeStep]);

    const extraPropsForGuardianSelection = useMemo<IGuardianSelectionStepContentProps>(() => {
      return {
        selectedGuardianAddress: selectedGuardianAddress,
      };
    }, [selectedGuardianAddress]);

    const stepContent = useMemo(() => {
      switch (activeStep.value) {
        // Select a guardian
        case STEPS_INDEXES.selectGuardian:
          return (
            <ApprovableWizardStep
              transactionCreationSubStepContent={GuardianSelectionStepContent}
              displayCongratulationsSubStep={false}
              finishedActionName={guardianSelectingWizardTranslations('finishedAction_selectedGuardian')}
              moveToNextStepAction={goToFinishStep}
              moveToNextStepTitle={wizardsCommonTranslations('moveToStep_finish')}
              key={'guardianSelectionStep'}
              closeWizard={closeWizard}
              propsForTransactionCreationSubStepContent={extraPropsForGuardianSelection}
            />
          );
        case STEPS_INDEXES.finish:
          return (
            <WizardFinishStep
              finishedActionDescription={guardianSelectingWizardTranslations('afterSuccessStateExplanation')}
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
      goToFinishStep,
      guardianSelectingWizardTranslations,
      wizardsCommonTranslations,
    ]);

    return (
      <WizardContainer data-testid={'wizard_staking'}>
        <Grid item>
          <WizardStepper activeStep={activeStep.value} alternativeLabel>
            <Step>
              <StepLabel>{guardianSelectingWizardTranslations('stepLabel_selectGuardian')}</StepLabel>
            </Step>

            <Step>
              <StepLabel>{wizardsCommonTranslations('stepLabel_finish')}</StepLabel>
            </Step>
          </WizardStepper>
        </Grid>
        <Grid item container>
          {stepContent}
        </Grid>
      </WizardContainer>
    );
  }),
);
