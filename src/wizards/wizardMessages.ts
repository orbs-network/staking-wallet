import { JSON_RPC_ERROR_CODES } from '../constants/ethereumErrorCodes';

export function messageFromTxCreationSubStepError(error: Error): { errorMessage: string; errorSubMessage: string } {
  const errorCode = (error as any).code;
  let errorMessage = '';
  let errorSubMessage = '';

  switch (errorCode) {
    case JSON_RPC_ERROR_CODES.provider.userRejectedRequest:
      errorMessage = 'You have canceled the transaction.';
      errorSubMessage = 'In order to continue, please try again and approve the transaction';
      break;
    default:
      errorMessage = 'An error occurred while trying to send transaction to the staking wallet.';
      errorSubMessage = 'please try again';
      break;
  }

  return {
    errorMessage,
    errorSubMessage,
  };
}

// TODO : O.L : Use proper translation mechanism instead of this const message.
export const PLEASE_APPROVE_TX_MESSAGE =
  'Please approve the transaction, we will move to the next stage as soon as the transaction is confirmed';