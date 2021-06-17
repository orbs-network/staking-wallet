import React from 'react';
import { observer } from 'mobx-react';
import { useWizardsCommonTranslations } from '../../translations/translationsHooks';
import { BaseStepContent } from '../approvableWizardStep/BaseStepContent';

interface IProps {
  finishedActionDescription: string;
  onFinishClicked: () => void;
}

export const WizardFinishStep = observer((props: IProps) => {
  const { finishedActionDescription, onFinishClicked } = props;

  const wizardsCommonTranslations = useWizardsCommonTranslations();

  return (
    <BaseStepContent
      contentTestId={'wizard_sub_step_finish'}
      title={wizardsCommonTranslations('stepDoneExclamation')}
      message={finishedActionDescription}
      subMessage={''}
      actionButtonProps={{
        title: wizardsCommonTranslations('action_finish'),
        onClick: onFinishClicked,
      }}
    />
  );
});
