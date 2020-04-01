import { UseBoolean, useBoolean, UseStateful, useStateful } from 'react-hanger';

export type TUseWizardStateHook = (
  initialMessage: string,
  initialSubMessage: string,
  initialIsBroadcasting: boolean,
) => {
  message: UseStateful<string>;
  subMessage: UseStateful<string>;
  isBroadcastingMessage: UseBoolean;
};

export const useWizardState: TUseWizardStateHook = (initialMessage, initialSubMessage, initialIsBroadcasting) => {
  const message = useStateful(initialMessage);
  const subMessage = useStateful(initialSubMessage);
  const isBroadcastingMessage = useBoolean(initialIsBroadcasting);

  return {
    message,
    subMessage,
    isBroadcastingMessage,
  };
};
