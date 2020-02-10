import React, { ReactNode, useMemo } from 'react';
import { Typography } from '@material-ui/core';
import { WizardContent } from '../../components/wizards/WizardContent';
import { CommonActionButton } from '../../components/base/CommonActionButton';
import Grid from '@material-ui/core/Grid';

export interface IActionButtonProps {
  title: string;
  onClick: () => void;
}

interface IProps {
  title: string;
  message: string;
  subMessage: string;

  innerContent?: ReactNode;
  actionButtonProps?: IActionButtonProps;
  disableInputs?: boolean;
  contentTestId?: string;
}

export const BaseStepContent = React.memo<IProps>(props => {
  const { title, message, subMessage, disableInputs, contentTestId, innerContent, actionButtonProps } = props;

  const actionButton = useMemo(() => {
    if (actionButtonProps) {
      return (
        <CommonActionButton disabled={disableInputs} onClick={actionButtonProps.onClick}>
          {actionButtonProps.title}
        </CommonActionButton>
      );
    } else {
      return null;
    }
  }, [actionButtonProps, disableInputs]);

  // TODO : O.L : Use proper grid system instead of the 'br's
  return (
    <WizardContent data-testid={contentTestId}>
      <Grid item>
        <Typography variant={'h5'}>{title}</Typography>
      </Grid>
      <Grid item>
        <Typography variant={'body1'}>{message}</Typography>
      </Grid>
      <Grid item>
        <Typography variant={'body2'}>{subMessage}</Typography>
      </Grid>

      <Grid item>{innerContent}</Grid>
      <Grid item>{actionButton}</Grid>
    </WizardContent>
  );
});
