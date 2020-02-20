import React, { useMemo } from 'react';
import { BaseStepContent, IActionButtonProps } from '../BaseStepContent';

interface IProps {
  finishedActionName: string;
  moveToNextStepAction: () => void;
  moveToNextStepTitle: string;
}

export const CongratulationsSubStepContent: React.FC<IProps> = (props: IProps) => {
  const { finishedActionName, moveToNextStepAction, moveToNextStepTitle } = props;

  const actionButtonProps = useMemo<IActionButtonProps>(
    () => ({
      onClick: moveToNextStepAction,
      title: moveToNextStepTitle,
    }),
    [moveToNextStepAction, moveToNextStepTitle],
  );

  return (
    <BaseStepContent
      message={`You have successfully ${finishedActionName}`}
      subMessage={''}
      title={'Congratulations'}
      contentTestId={'wizard_sub_step_congratulations'}
      actionButtonProps={actionButtonProps}
    />
  );
};
