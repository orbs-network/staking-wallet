import React from 'react';
import { observer } from 'mobx-react';
import { Button, Typography } from '@material-ui/core';
import { WizardContent } from '../../components/wizards/WizardContent';
import { useWizardsCommonTranslations } from '../../translations/translationsHooks';

interface IProps {
  finishedActionDescription: string;
  onFinishClicked: () => void;
}

export const WizardFinishStep = observer((props: IProps) => {
  const { finishedActionDescription, onFinishClicked } = props;

  const wizardsCommonTranslations = useWizardsCommonTranslations();

  return (
    <WizardContent data-testid={'wizard_sub_step_finish'}>
      <Typography>{wizardsCommonTranslations('stepDoneExclamation')}</Typography>
      <Typography>{finishedActionDescription}</Typography>
      <Button onClick={onFinishClicked}>{wizardsCommonTranslations('action_finish')}</Button>
    </WizardContent>
  );
});
