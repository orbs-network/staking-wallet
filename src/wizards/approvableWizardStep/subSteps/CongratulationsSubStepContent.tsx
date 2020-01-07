import React, { useEffect } from 'react';
import { Button, Typography } from '@material-ui/core';
import { WizardContent } from '../../../components/wizards/WizardContent';

interface IProps {
  moveToNextStepAction: () => void;
  moveToNextStepTitle: string;
}

export const CongratulationsSubStepContent: React.FC<IProps> = (props: IProps) => {
  const { moveToNextStepAction, moveToNextStepTitle } = props;

  // TODO : O.L : Use proper grid system instead of the 'br's
  return (
    <WizardContent data-testid={'wizard_step_wait_for_staking_confirmation'}>
      <Typography>Congratulations !</Typography>
      <Typography variant={'caption'}>{'You have successfully --Action Name--'}</Typography>
      <Button onClick={moveToNextStepAction}>{moveToNextStepTitle}</Button>
    </WizardContent>
  );
};
