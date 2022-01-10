import { UseBoolean, UseStateful } from 'react-hanger';
import { PromiEvent, TransactionReceipt } from 'web3-core';

interface IProps {
  isApproveEnabled?: boolean;
  message: UseStateful<string>;
  subMessage: UseStateful<string>;
  isBroadcastingMessage: UseBoolean;
  promiEvent: PromiEvent<TransactionReceipt>;
  onPromiEventAction: any;
  reReadStoresData: any;
  wizardsCommonTranslations: any;
  errorHandler: (error: Error) => void;
  warnMsg?: string;
  analyticsHandler?: any;
}

export const handleApprove = ({
  isApproveEnabled,
  message,
  subMessage,
  promiEvent,
  isBroadcastingMessage,
  onPromiEventAction,
  reReadStoresData,
  wizardsCommonTranslations,
  errorHandler,
  warnMsg,
  analyticsHandler,
}: IProps) => {
  if (!isApproveEnabled && warnMsg) {
    console.warn(warnMsg);
    return null;
  }

  message.setValue('');
  subMessage.setValue(wizardsCommonTranslations('subMessage_pleaseApproveTransactionWithExplanation'));

  // DEV_NOTE : If we have txHash, it means the user click on 'confirm' and generated one.
  promiEvent.on('transactionHash', (txHash) => {
    subMessage.setValue(wizardsCommonTranslations('subMessage_broadcastingYourTransactionDoNotRefreshOrCloseTab'));
    isBroadcastingMessage.setTrue();
  });

  promiEvent.on('error', (error: Error) => {
    errorHandler(error);
    console.error(error);
  });

  onPromiEventAction(promiEvent, () => {
    if (analyticsHandler) {
      analyticsHandler();
    }
  });
};

export default handleApprove;
