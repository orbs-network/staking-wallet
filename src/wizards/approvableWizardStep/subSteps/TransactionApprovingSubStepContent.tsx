import React, { useContext, useEffect, useMemo } from 'react';
import { Link, Typography } from '@material-ui/core';
import { useStateful } from 'react-hanger';
import { BaseStepContent } from '../BaseStepContent';
import { useApprovableWizardStepTranslations } from '../../../translations/translationsHooks';
import { CommonActionButton } from '../../../components/base/CommonActionButton';
import config from '../../../../config/index';
import { MobXProviderContext } from 'mobx-react';

interface IProps {
  txHash: string;
  confirmationsCount: number;
  onStepFinished(): void;
  requiredConfirmations: number;
  transactionFinished: boolean;
}

const getBlockExplorer = (chain: number) => {
  const network = config.networks[chain];
  if (!network) {
    return;
  }
  return config.networks[chain].blockExplorerUrl;
};

export const TransactionApprovingSubStepContent: React.FC<IProps> = (props: IProps) => {
  const { onStepFinished, txHash, confirmationsCount, requiredConfirmations, transactionFinished } = props;
  const { chainId } = useContext(MobXProviderContext);
  const blockExplorer = getBlockExplorer(chainId);
  const approvableWizardStepTranslations = useApprovableWizardStepTranslations();

  const transactionApprovementContent = useMemo(() => {
    let actionContent = null;
    if (transactionFinished) {
      actionContent = (
        <CommonActionButton onClick={onStepFinished}>
          {approvableWizardStepTranslations('action_proceed')}
        </CommonActionButton>
      );
    } else {
      actionContent = (
        <Typography variant={'caption'}>{approvableWizardStepTranslations('thisMightTakeAFewMoments')}</Typography>
      );
    }

    return actionContent;
  }, [approvableWizardStepTranslations, transactionFinished, onStepFinished]);

  const titleMessage = useMemo(() => {
    return transactionFinished
      ? approvableWizardStepTranslations('txConfirmed').toLocaleUpperCase()
      : approvableWizardStepTranslations('txPending').toLocaleUpperCase();
  }, [transactionFinished]);

  const blockExplorerLink = useMemo(
    () => (
      <Typography>
        You can see the transaction{' '}
        <Link
          href={`${blockExplorer}/tx/${txHash}`}
          rel={'noopener noreferrer'}
          target={'_blank'}
          underline='always'
          style={{ color: '#2196f3' }}
        >
          here
        </Link>
      </Typography>
    ),
    [txHash, blockExplorer],
  );

  return (
    <BaseStepContent
      title={titleMessage}
      component={blockExplorerLink}
      disableInputs={false}
      contentTestId={'wizard_sub_step_wait_for_tx_confirmation'}
      innerContent={transactionApprovementContent}
      isLoading={!transactionFinished}
    />
  );
};
