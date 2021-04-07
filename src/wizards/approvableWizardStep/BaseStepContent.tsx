import React, { ReactNode, useMemo } from 'react';
import { Typography, CircularProgress, Box } from '@material-ui/core';
import { WizardContent } from '../../components/wizards/WizardContent';
import { CommonActionButton } from '../../components/base/CommonActionButton';
import Grid from '@material-ui/core/Grid';
import { InfoToolTipIcon } from '../../components/tooltips/InfoTooltipIcon';

export interface IActionButtonProps {
  title: string;
  onClick: () => void;
  isDisabled?: boolean;
}

interface IProps {
  // Display
  title: string | React.ElementType;
  message?: string;
  subMessage?: string;
  infoTitle?: string;
  innerContent?: ReactNode;
  disableInputs?: boolean;
  isLoading?: boolean;

  // Action button
  actionButtonProps?: IActionButtonProps;
  disableActionButton?: boolean;

  // Cancel button
  addCancelButton?: boolean;
  cancelButtonText?: string;
  onCancelButtonClicked?: () => void;

  // Tests props
  contentTestId?: string;
}

const stylingForTwoActionButtons: React.CSSProperties = {
  width: '8em',
};

const stylingForSingleActionButton: React.CSSProperties = {};

export const BaseStepContent = React.memo<IProps>((props) => {
  const {
    title,
    message,
    subMessage,
    disableInputs,
    disableActionButton,
    isLoading,
    contentTestId,
    innerContent,
    actionButtonProps,
    addCancelButton,
    cancelButtonText,
    onCancelButtonClicked,
    infoTitle,
  } = props;

  const relevantStylingForActionButtons = addCancelButton ? stylingForTwoActionButtons : stylingForSingleActionButton;
  const actionButton = useMemo(() => {
    if (actionButtonProps) {
      const { onClick, title, isDisabled } = actionButtonProps;

      return (
        <CommonActionButton
          style={relevantStylingForActionButtons}
          disabled={disableInputs || disableActionButton || isDisabled}
          onClick={onClick}
        >
          {title}
        </CommonActionButton>
      );
    } else {
      return null;
    }
  }, [actionButtonProps, disableActionButton, disableInputs, relevantStylingForActionButtons]);
  const hasAnyButtons = !!actionButton || addCancelButton;

  const titleContent = useMemo(() => {
    if (typeof title === 'string') {
      return title;
    } else {
      const Title = title;
      return <Title />;
    }
  }, [title]);

  const infoTooltippedIcon = useMemo(() => {
    if (infoTitle) {
      return <InfoToolTipIcon tooltipTitle={infoTitle} />;
    } else {
      return null;
    }
  }, [infoTitle]);

  const hasMessage = message && message.length > 0;
  const hasSubMessage = subMessage && subMessage.length > 0;

  return (
    <WizardContent data-testid={contentTestId}>
      {/* Title */}
      <Grid container item direction={'row'} justify={'center'} alignItems={'center'} style={{ textAlign: 'center' }}>
        <Typography variant={'h5'} style={{ fontWeight: 'bold', paddingRight: '0.25em' }}>
          {titleContent}
        </Typography>
        {infoTooltippedIcon}
      </Grid>

      <Grid item hidden={!hasMessage} style={{ textAlign: 'center' }}>
        <Typography variant={'body1'}>{message}</Typography>
      </Grid>

      {/* Sub Message */}
      <Grid item hidden={!hasSubMessage} style={{ textAlign: 'center' }}>
        <Typography variant={'body2'}>{subMessage}</Typography>
      </Grid>

      {/* Display loading */}
      {isLoading && (
        <Grid item container direction={'column'} alignItems={'center'} style={{ textAlign: 'center' }}>
          <Grid item>
            <CircularProgress color={'secondary'} />
          </Grid>
        </Grid>
      )}

      {/* Inner Content */}
      {/* DEV_NOTE : 'container' handles taking the full width*/}
      <Grid item container justify={'center'} style={{ position: 'relative' }}>
        {innerContent}
      </Grid>

      {/* Action Buttons */}
      {hasAnyButtons && (
        <Grid
          item
          container
          justify={'space-around'}
          direction={'row'}
          spacing={0}
          style={{ margin: 0, width: '100%' }}
        >
          {addCancelButton && (
            <Grid item>
              <CommonActionButton
                style={relevantStylingForActionButtons}
                onClick={onCancelButtonClicked}
                disabled={disableInputs}
              >
                {/* TODO : ORL : Make default 'cancel' */}
                {/*{cancelButtonText || wizardsCommonTranslations('action_close')}*/}
                {cancelButtonText || 'Cancel'}
              </CommonActionButton>
            </Grid>
          )}
          <Grid item>{actionButton}</Grid>
        </Grid>
      )}
    </WizardContent>
  );
});
