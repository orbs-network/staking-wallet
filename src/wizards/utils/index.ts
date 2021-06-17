import { IActionButtonProps } from './../approvableWizardStep/BaseStepContent';

export const createActionButtonProps = (
  onClick: () => void,
  title: string,
  isDisabled: boolean,
): IActionButtonProps => {
  console.log('lalala');
  return {
    onClick,
    title,
    isDisabled,
  };
};
