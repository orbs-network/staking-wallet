import { UseBoolean, useBoolean, UseStateful, useStateful } from 'react-hanger';
import { useEffect } from 'react';
import { messageFromTxCreationSubStepError } from './wizardMessages';
import { useWizardsCommonTranslations } from '../translations/translationsHooks';

export type TUseWizardStateHook = (
  initialMessage: string,
  initialSubMessage: string,
  initialIsBroadcasting: boolean,
) => {
  message: UseStateful<string>;
  subMessage: UseStateful<string>;
  txHash: UseStateful<string | null>;
  isBroadcastingMessage: UseBoolean;
};

export type TUseTxCreationErrorHandlingEffect = (
  message: UseStateful<string>,
  subMessage: UseStateful<string>,
  isBroadcastingMessage: UseBoolean,
  txError: Error,
) => void;

export const useWizardState: TUseWizardStateHook = (initialMessage, initialSubMessage, initialIsBroadcasting) => {
  const message = useStateful(initialMessage);
  const subMessage = useStateful(initialSubMessage);
  const isBroadcastingMessage = useBoolean(initialIsBroadcasting);
  // DEV_NOTE : O.L : This is a bit hacky, added the txHash here until we will move it to a centrelized store.
  const txHash = useStateful(null);

  return {
    message,
    subMessage,
    isBroadcastingMessage,
    txHash,
  };
};

export const useTxCreationErrorHandlingEffect: TUseTxCreationErrorHandlingEffect = (
  message,
  subMessage,
  isBroadcastingMessage,
  txError,
) => {
  const wizardsCommonTranslations = useWizardsCommonTranslations();

  useEffect(() => {
    if (txError) {
      const { errorMessage, errorSubMessage } = messageFromTxCreationSubStepError(txError, wizardsCommonTranslations);
      message.setValue(errorMessage);
      subMessage.setValue(errorSubMessage);
      isBroadcastingMessage.setFalse();
    }
  }, [txError, wizardsCommonTranslations, message, subMessage, isBroadcastingMessage]);
};
