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

  return (
    <WizardContent data-testid={'wizard_sub_step_congratulations'}>
      <Typography variant={'h5'}>Congratulations !</Typography>
      <Typography variant={'body1'}>{`You have successfully ${finishedActionName}`}</Typography>
      <Button onClick={moveToNextStepAction}>{moveToNextStepTitle}</Button>
    </WizardContent>
  );
};
