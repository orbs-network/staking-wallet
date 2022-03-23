import React, { ReactNode, useMemo } from 'react';
import { Typography, CircularProgress, Box } from '@material-ui/core';
import { WizardContent } from '../../components/wizards/WizardContent';
import { CommonActionButton } from '../../components/base/CommonActionButton';
import Grid from '@material-ui/core/Grid';
import { InfoToolTipIcon } from '../../components/tooltips/InfoTooltipIcon';
import { CommonClosePopupButton } from '../../components/base/commonClosePopupButton';
import { makeStyles } from '@material-ui/core/styles';

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
  component?: ReactNode;
  // Tests props
  contentTestId?: string;
  close?: () => void;
}

const stylingForTwoActionButtons: React.CSSProperties = {
  width: '8em',
};

const useStyles = makeStyles({
  longText: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    width: '100%',
  },
});

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
    close,
    component,
  } = props;
  const classes = useStyles();
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
  // change to string
  return (
    <WizardContent data-testid={contentTestId}>
      {/* Title */}
      <Grid container item direction={'row'} justify={'center'} alignItems={'center'} style={{ textAlign: 'center' }}>
        <Typography variant={'h5'} style={{ fontWeight: 'bold', paddingRight: '0.25em' }}>
          {titleContent}
        </Typography>
        {infoTooltippedIcon}
      </Grid>

      <Grid item hidden={!hasMessage} style={{ textAlign: 'center' }} className={classes.longText}>
        <Typography variant={'body1'}>{message}</Typography>
      </Grid>

      <Grid item hidden={!component} style={{ textAlign: 'center', marginBottom:'10px' }}>
        {component}
      </Grid>
      <Grid item hidden={!hasSubMessage} style={{ textAlign: 'center' }}>
        <Typography variant={'body2'}>{subMessage}</Typography>
      </Grid>

      {/* Display loading */}
      {isLoading && (
        <Grid item container direction={'column'} alignItems={'center'} style={{ textAlign: 'center', marginTop: 10 }}>
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
      {close && <CommonClosePopupButton onClick={close} />}
      {/* Action Buttons */}
      {hasAnyButtons && (
        <Grid
          item
          container
          justify={'space-around'}
          direction={'row'}
          spacing={0}
          style={{ margin: 0, width: '100%', marginTop: '10px' }}
        >
          
          {addCancelButton && (
            <Grid>
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
