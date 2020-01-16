import React from 'react';
import { Button, Typography } from '@material-ui/core';
import { WizardContent } from '../../../components/wizards/WizardContent';

interface IProps {
  finishedActionName: string;
  moveToNextStepAction: () => void;
  moveToNextStepTitle: string;
}

export const CongratulationsSubStepContent: React.FC<IProps> = (props: IProps) => {
  const { finishedActionName, moveToNextStepAction, moveToNextStepTitle } = props;

  // TODO : O.L : Use proper grid system instead of the 'br's
  return (
    <WizardContent data-testid={'wizard_sub_step_congratulations'}>
      <Typography>Congratulations !</Typography>
      <Typography variant={'caption'}>{`You have successfully ${finishedActionName}`}</Typography>
      <Button onClick={moveToNextStepAction}>{moveToNextStepTitle}</Button>
    </WizardContent>
  );
};
