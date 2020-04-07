import React, { useMemo } from 'react';
import { BaseStepContent, IActionButtonProps } from '../BaseStepContent';
import { useApprovableWizardStepTranslations } from '../../../translations/translationsHooks';

interface IProps {
  finishedActionName: string;
  moveToNextStepAction: () => void;
  moveToNextStepTitle: string;
}

export const CongratulationsSubStepContent: React.FC<IProps> = (props: IProps) => {
  const { finishedActionName, moveToNextStepAction, moveToNextStepTitle } = props;

  const approvableWizardStepTranslations = useApprovableWizardStepTranslations();
  const actionButtonProps = useMemo<IActionButtonProps>(
    () => ({
      onClick: moveToNextStepAction,
      title: moveToNextStepTitle,
    }),
    [moveToNextStepAction, moveToNextStepTitle],
  );

  return (
    <BaseStepContent
      message={approvableWizardStepTranslations('youHaveDoneActionSuccessfully', { finishedActionName })}
      subMessage={''}
      title={approvableWizardStepTranslations('congratulations')}
      contentTestId={'wizard_sub_step_congratulations'}
      actionButtonProps={actionButtonProps}
    />
  );
};
