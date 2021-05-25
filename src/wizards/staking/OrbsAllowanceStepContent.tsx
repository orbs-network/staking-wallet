import React, { useCallback, useMemo } from 'react';
import { useNumber } from 'react-hanger';
import { useOrbsAccountStore, useReReadAllStoresData } from '../../store/storeHooks';
import { ITransactionCreationStepProps } from '../approvableWizardStep/ApprovableWizardStep';
import { observer } from 'mobx-react';
import { fullOrbsFromWeiOrbs, weiOrbsFromFullOrbs } from '../../cryptoUtils/unitConverter';
import { BaseStepContent, IActionButtonProps } from '../approvableWizardStep/BaseStepContent';
import { useStakingWizardTranslations, useWizardsCommonTranslations } from '../../translations/translationsHooks';
import { FullWidthOrbsInputField } from '../../components/inputs/FullWidthOrbsInputField';
import { useTxCreationErrorHandlingEffect, useWizardState } from '../wizardHooks';
import { enforceNumberInRange } from '../../utils/numberUtils';
import { MaxButton } from '../../components/base/maxButton';

export interface IOrbsAllowanceStepContentProps {
  goBackToChooseGuardianStep: () => void;
}

export const OrbsAllowanceStepContent = observer(
  (props: ITransactionCreationStepProps & IOrbsAllowanceStepContentProps) => {
    const { disableInputs, onPromiEventAction, txError, closeWizard, goBackToChooseGuardianStep } = props;

    const wizardsCommonTranslations = useWizardsCommonTranslations();
    const stakingWizardTranslations = useStakingWizardTranslations();
    const orbsAccountStore = useOrbsAccountStore();

    const reReadStoresData = useReReadAllStoresData();

    // Start and limit by liquid orbs
    const liquidOrbsAsNumber = fullOrbsFromWeiOrbs(orbsAccountStore.liquidOrbs);
    const orbsAllowance = useNumber(liquidOrbsAsNumber, { lowerLimit: 0, upperLimit: liquidOrbsAsNumber });
    const { message, subMessage, isBroadcastingMessage } = useWizardState(
      stakingWizardTranslations('allowanceSubStep_message_selectAmountOfOrbs'),
      '',
      false,
    );

    // Handle error by displaying the proper error message
    useTxCreationErrorHandlingEffect(message, subMessage, isBroadcastingMessage, txError);

    const setTokenAllowanceForStakingContract = useCallback(() => {
      // TODO : FUTURE : O.L : Add written error message about out of range
      if (orbsAllowance.value <= 0 || orbsAllowance.value > liquidOrbsAsNumber) {
        console.warn(`tried to set out of range allowance of ${orbsAllowance.value}`);
        return;
      }
      message.setValue('');
      subMessage.setValue(wizardsCommonTranslations('subMessage_pleaseApproveTransactionWithExplanation'));
      const stakingAmount = weiOrbsFromFullOrbs(orbsAllowance.value);
      const promiEvent = orbsAccountStore.setAllowanceForStakingContract(stakingAmount);

      // DEV_NOTE : If we have txHash, it means the user click on 'confirm' and generated one.
      promiEvent.on('transactionHash', (txHash) => {
        subMessage.setValue(wizardsCommonTranslations('subMessage_broadcastingYourTransactionDoNotRefreshOrCloseTab'));
        isBroadcastingMessage.setTrue();
      });

      onPromiEventAction(promiEvent, () => {
        reReadStoresData();
      });
    }, [
      orbsAllowance.value,
      liquidOrbsAsNumber,
      message,
      subMessage,
      wizardsCommonTranslations,
      orbsAccountStore,
      onPromiEventAction,
      isBroadcastingMessage,
      reReadStoresData,
    ]);
    const showMaxBtn = liquidOrbsAsNumber !== orbsAllowance.value || liquidOrbsAsNumber === 0;
    const actionButtonProps = useMemo<IActionButtonProps>(
      () => ({
        onClick: setTokenAllowanceForStakingContract,
        title: stakingWizardTranslations('allowanceSubStep_action_approve'),
        isDisabled: orbsAllowance.value > liquidOrbsAsNumber || !orbsAllowance.value,
      }),
      [liquidOrbsAsNumber, orbsAllowance.value, setTokenAllowanceForStakingContract, stakingWizardTranslations],
    );
    const handleMax = useCallback(() => {
      orbsAllowance.setValue(liquidOrbsAsNumber);
    }, [liquidOrbsAsNumber, orbsAllowance]);

    const allowanceInput = useMemo(() => {
      const maxBtn = (
        <MaxButton disabled={!showMaxBtn} onClick={handleMax}>
          {wizardsCommonTranslations('popup_max')}
        </MaxButton>
      );
      return (
        <FullWidthOrbsInputField
          id={'orbsAllowance'}
          placeholder={wizardsCommonTranslations('popup_input_placeholder')}
          value={orbsAllowance.value}
          onChange={(value) => orbsAllowance.setValue(Number(value))}
          disabled={disableInputs}
          buttonComponent={maxBtn}
        />
      );
    }, [showMaxBtn, handleMax, wizardsCommonTranslations, orbsAllowance, disableInputs]);

    // TODO : ORL : TRANSLATIONS
    return (
      <BaseStepContent
        message={message.value}
        subMessage={subMessage.value}
        title={stakingWizardTranslations('allowanceSubStep_stepTitle')}
        infoTitle={stakingWizardTranslations('allowanceSubStep_stepExplanation')}
        disableInputs={disableInputs}
        isLoading={isBroadcastingMessage.value}
        contentTestId={'wizard_sub_step_initiate_allowance_tx'}
        actionButtonProps={actionButtonProps}
        innerContent={allowanceInput}
        addCancelButton
        close={closeWizard}
        onCancelButtonClicked={goBackToChooseGuardianStep}
        // cancelButtonText={wizardsCommonTranslations('action_close')}
        cancelButtonText={stakingWizardTranslations('backToStep_changeGuardian')}
      />
    );
  },
);
