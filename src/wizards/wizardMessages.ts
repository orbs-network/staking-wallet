import { JSON_RPC_ERROR_CODES } from '../constants/ethereumErrorCodes';
import { useWizardsCommonTranslations } from '../translations/translationsHooks';

export function messageFromTxCreationSubStepError(
  error: Error,
  wizardsCommonTranslations: ReturnType<typeof useWizardsCommonTranslations>,
): { errorMessage: string; errorSubMessage: string } {
  const errorCode = (error as any).code;
  let errorMessage = '';
  let errorSubMessage = '';

  switch (errorCode) {
    case JSON_RPC_ERROR_CODES.provider.userRejectedRequest:
      errorMessage = wizardsCommonTranslations('txCreationError_userCanceled_message');
      errorSubMessage = wizardsCommonTranslations('txCreationError_userCanceled_subMessage');
      break;
    default:
      errorMessage = wizardsCommonTranslations('txCreationError_generalError_message');
      errorSubMessage = wizardsCommonTranslations('txCreationError_generalError_subMessage');
      break;
  }

  return {
    errorMessage,
    errorSubMessage,
  };
}
