import React, { useCallback, useContext, useEffect, useMemo, useRef } from 'react';
import { useBoolean, useNumber, useStateful } from 'react-hanger';
import { PromiEvent, TransactionReceipt } from 'web3-core';
import { MobXProviderContext } from 'mobx-react';
import { TransactionApprovingSubStepContent } from './subSteps/TransactionApprovingSubStepContent';
import { CongratulationsSubStepContent } from './subSteps/CongratulationsSubStepContent';
import { useOrbsAccountStore, useReReadAllStoresData } from '../../store/storeHooks';
import errorMonitoring from '../../services/error-monitoring';
import config from '../../../config';
import useReceipt from './useReceipt';
type TStepState = 'Action' | 'Confirmation' | 'Success';

// const REQUIRED_CONFIRMATIONS = 7;

export interface ITransactionCreationStepProps {
  onPromiEventAction(promiEvent: PromiEvent<TransactionReceipt>, afterTxConfirmedCb?: () => void): void;
  skipToSuccess: () => void;
  disableInputs: boolean;
  closeWizard?: () => void;
  txError?: Error;
}

interface IProps<T = {}> {
  // Tx creation sub step
  transactionCreationSubStepContent: React.FC<ITransactionCreationStepProps & T>;

  // Congratulations sub step
  displayCongratulationsSubStep: boolean;
  finishedActionName: string;
  moveToNextStepAction: () => void;
  moveToNextStepTitle: string;

  // Wizard interaction
  closeWizard: () => void;

  // Extra props for the tx creation step
  propsForTransactionCreationSubStepContent?: object;
}

export const ApprovableWizardStep = React.memo<IProps>((props) => {
  const {
    transactionCreationSubStepContent: TransactionCreationSubStepContent,
    displayCongratulationsSubStep,
    finishedActionName,
    moveToNextStepAction,
    moveToNextStepTitle,
    propsForTransactionCreationSubStepContent,
    closeWizard,
  } = props;
  const { chainId } = useContext(MobXProviderContext);
  const requiredConfirmations = config.networks[chainId].requiredConfirmations;
  const { needsManualUpdatingOfState, manuallyReadAccountData } = useOrbsAccountStore();
  const reReadStoresData = useReReadAllStoresData();

  const stepState = useStateful<TStepState>('Action');
  const { transactionFinished, onReceipt } = useReceipt();
  const unsubscribeFromAllPromiventListenersRef = useRef<() => void>(null);
  const goToApprovalSubStep = useCallback(() => stepState.setValue('Confirmation'), [stepState]);
  const goToCongratulationSubStep = useCallback(() => stepState.setValue('Success'), [stepState]);

  const unsubscribeFromAllPromiventListeners = useCallback(() => {
    if (unsubscribeFromAllPromiventListenersRef.current) {
      unsubscribeFromAllPromiventListenersRef.current();
    }
  }, [unsubscribeFromAllPromiventListenersRef]);

  const onTransactionApprovingSubStepFinished = useCallback(() => {
    // First, unsubscribe
    unsubscribeFromAllPromiventListeners();

    // TODO : ORL : If this type of manual updating works, lets make this part into a function prop
    // DEV_NOTE : This manually updating part is less about the wizard logic and more about
    //            helping us maintain the true state of the address after each action.
    // Then, if our ethereum provider has no event support, we will want to read
    if (needsManualUpdatingOfState) {
      manuallyReadAccountData();
    }

    // Do we want to display the congratulations sub step ?
    if (displayCongratulationsSubStep) {
      goToCongratulationSubStep();
    } else {
      moveToNextStepAction();
    }
  }, [
    unsubscribeFromAllPromiventListeners,
    goToCongratulationSubStep,
    moveToNextStepAction,
    displayCongratulationsSubStep,
    manuallyReadAccountData,
    needsManualUpdatingOfState,
  ]);

  const disableTxCreationInputs = useBoolean(false);
  const txHash = useStateful<string>('');
  const txConfirmationsCount = useNumber(0);
  const txCreatingError = useStateful<Error>(null);

  const txCreationAction = useCallback<
    (promiEvent: PromiEvent<TransactionReceipt>, afterTxConfirmedCb?: () => void) => void
  >(
    (promiEvent, afterTxConfirmedCb) => {
      disableTxCreationInputs.setTrue();
      let afterConfirmationCbCalled = false;

      unsubscribeFromAllPromiventListenersRef.current = () => {
        return (promiEvent as any).removeAllListeners();
      };

      promiEvent.on('confirmation', (confirmation, details) => {
        txConfirmationsCount.setValue(confirmation);

        if (!afterConfirmationCbCalled && afterTxConfirmedCb) {
          afterConfirmationCbCalled = true;

          afterTxConfirmedCb();
        }

        // DEV_NOTE : By API definition, the 'promivent' will fire up until confirmation number 24.
        if (confirmation >= 10) {
          disableTxCreationInputs.setFalse();
        }
      });
      promiEvent.once('transactionHash', (hash) => {
        txHash.setValue(hash);
        goToApprovalSubStep();
        disableTxCreationInputs.setFalse();
      });

      promiEvent.on('receipt', (receipt) => {
        console.log(receipt);
        onReceipt(receipt.blockNumber, reReadStoresData);
      });

      promiEvent.on('error', (error) => {
        const { sections, captureException } = errorMonitoring;
        txCreatingError.setValue(error);
        captureException(error, sections.approvableWizardStep);
        (promiEvent as any).removeAllListeners();
        disableTxCreationInputs.setFalse();
      });
    },
    [disableTxCreationInputs, txConfirmationsCount, txHash, goToApprovalSubStep, onReceipt, txCreatingError],
  );

  console.log({ txConfirmationsCount: txConfirmationsCount.value });

  useEffect(() => {
    return () => {
      if (unsubscribeFromAllPromiventListenersRef.current) {
        unsubscribeFromAllPromiventListenersRef.current();
      }
    };
  }, []);


  const currentSubStepContent = useMemo(() => {
    switch (stepState.value) {
      case 'Action':
        return (
          <TransactionCreationSubStepContent
            disableInputs={disableTxCreationInputs.value}
            txError={txCreatingError.value}
            onPromiEventAction={txCreationAction}
            skipToSuccess={displayCongratulationsSubStep ? goToCongratulationSubStep : moveToNextStepAction}
            closeWizard={closeWizard}
            {...propsForTransactionCreationSubStepContent}
          />
        );
      case 'Confirmation':
        return (
          <TransactionApprovingSubStepContent
            requiredConfirmations={requiredConfirmations}
            confirmationsCount={txConfirmationsCount.value}
            txHash={txHash.value}
            onStepFinished={onTransactionApprovingSubStepFinished}
          />
        );
      case 'Success':
        return (
          <CongratulationsSubStepContent
            finishedActionName={finishedActionName}
            moveToNextStepAction={moveToNextStepAction}
            moveToNextStepTitle={moveToNextStepTitle}
          />
        );
      default:
        throw new Error(`Invalid step state value of ${stepState.value}`);
    }
  }, [
    stepState.value,
    disableTxCreationInputs.value,
    txCreatingError.value,
    txCreationAction,
    displayCongratulationsSubStep,
    goToCongratulationSubStep,
    moveToNextStepAction,
    closeWizard,
    propsForTransactionCreationSubStepContent,
    requiredConfirmations,
    txConfirmationsCount.value,
    transactionFinished,
    txHash.value,
    onTransactionApprovingSubStepFinished,
    finishedActionName,
    moveToNextStepTitle,
  ]);

  return currentSubStepContent;
});
