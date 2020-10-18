import React, { useCallback, useEffect, useMemo } from 'react';
import { useBoolean, useStateful } from 'react-hanger';
import { useOrbsAccountStore, useReReadAllStoresData } from '../../store/storeHooks';
import { ITransactionCreationStepProps } from '../approvableWizardStep/ApprovableWizardStep';
import { observer } from 'mobx-react';
import { fullOrbsFromWeiOrbs } from '../../cryptoUtils/unitConverter';
import { messageFromTxCreationSubStepError } from '../wizardMessages';
import { BaseStepContent, IActionButtonProps } from '../approvableWizardStep/BaseStepContent';
import { useStakingWizardTranslations, useWizardsCommonTranslations } from '../../translations/translationsHooks';
import { useTxCreationErrorHandlingEffect, useWizardState } from '../wizardHooks';
import { useAnalyticsService } from '../../services/ServicesHooks';
import { STAKING_ACTIONS } from '../../services/analytics/analyticConstants';

export interface IOrbsStakingStepContentProps {
  goBackToApproveStep: () => void;
}

export const OrbsStakingStepContent = observer(
  (props: ITransactionCreationStepProps & IOrbsStakingStepContentProps) => {
    const { disableInputs, onPromiEventAction, txError, goBackToApproveStep } = props;

    const wizardsCommonTranslations = useWizardsCommonTranslations();
    const stakingWizardTranslations = useStakingWizardTranslations();
    const orbsAccountStore = useOrbsAccountStore();
    const analyticsService = useAnalyticsService();

    const reReadStoresData = useReReadAllStoresData();

    // Start and limit by allowance
    const orbsForStaking = orbsAccountStore.stakingContractAllowance;
    const fullOrbsForStaking = fullOrbsFromWeiOrbs(orbsForStaking);
    const { message, subMessage, isBroadcastingMessage } = useWizardState('', '', false);

    // Handle error by displaying the proper error message
    useTxCreationErrorHandlingEffect(message, subMessage, isBroadcastingMessage, txError);

    const stakeTokens = useCallback(() => {
      message.setValue('');
      subMessage.setValue(wizardsCommonTranslations('subMessage_pleaseApproveTransactionWithExplanation'));

      const promiEvent = orbsAccountStore.stakeTokens(orbsForStaking);

      // DEV_NOTE : If we have txHash, it means the user click on 'confirm' and generated one.
      promiEvent.on('transactionHash', (txHash) => {
        subMessage.setValue(wizardsCommonTranslations('subMessage_broadcastingYourTransactionDoNotRefreshOrCloseTab'));
        isBroadcastingMessage.setTrue();
      });

      onPromiEventAction(promiEvent, () => {
        analyticsService.trackStakingContractInteractionSuccess(STAKING_ACTIONS.staking, fullOrbsForStaking);
        reReadStoresData();
      });
    }, [
      message,
      subMessage,
      wizardsCommonTranslations,
      orbsAccountStore,
      orbsForStaking,
      onPromiEventAction,
      isBroadcastingMessage,
      analyticsService,
      fullOrbsForStaking,
      reReadStoresData,
    ]);

    const actionButtonProps = useMemo<IActionButtonProps>(
      () => ({
        onClick: stakeTokens,
        title: 'Stake',
      }),
      [stakeTokens],
    );

    // TODO : ORL : TRANSLATIONS
    const infoTitleToTranslate =
      'This step will transfer your ORBS to the staking contract and stake them. Staking makes the Orbs Network more secure and incentivizes the Delegators and Guardians to participate.';
    const cancelButtonText = 'Change amount';

    return (
      <BaseStepContent
        message={message.value}
        subMessage={subMessage.value}
        title={stakingWizardTranslations('stakingSubStep_stepTitle', {
          orbsForStaking: fullOrbsForStaking.toLocaleString(),
        })}
        // infoTitle={stakingWizardTranslations('stakingSubStep_stepExplanation')}
        infoTitle={infoTitleToTranslate}
        disableInputs={disableInputs}
        isLoading={isBroadcastingMessage.value}
        contentTestId={'wizard_sub_step_initiate_staking_tx'}
        actionButtonProps={actionButtonProps}
        addCancelButton={true}
        onCancelButtonClicked={goBackToApproveStep}
        cancelButtonText={cancelButtonText}
      />
    );
  },
);
