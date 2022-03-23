import { IActionButtonProps } from './../approvableWizardStep/BaseStepContent';

export const createActionButtonProps = (
  onClick: () => void,
  title: string,
  isDisabled: boolean,
): IActionButtonProps => {
  return {
    onClick,
    title,
    isDisabled,
  };
};
