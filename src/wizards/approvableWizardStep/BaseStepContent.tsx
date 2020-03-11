import React, { ReactNode, useMemo } from 'react';
import { Typography } from '@material-ui/core';
import { WizardContent } from '../../components/wizards/WizardContent';
import { CommonActionButton } from '../../components/base/CommonActionButton';
import Grid from '@material-ui/core/Grid';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import { HtmlTooltip } from '../../components/base/HtmlTooltip';
import Button from '@material-ui/core/Button';
import { useWizardsCommonTranslations } from '../../translations/translationsHooks';

export interface IActionButtonProps {
  title: string;
  onClick: () => void;
}

interface IProps {
  title: string | React.ElementType;
  message: string;
  subMessage: string;

  innerContent?: ReactNode;
  infoTitle?: string;
  actionButtonProps?: IActionButtonProps;
  disableInputs?: boolean;
  addCancelButton?: boolean;
  onCancelButtonClicked?: () => void;
  contentTestId?: string;
}

const stylingForActionButtons: React.CSSProperties = {
  width: '7em',
};

export const BaseStepContent = React.memo<IProps>(props => {
  const {
    title,
    message,
    subMessage,
    disableInputs,
    contentTestId,
    innerContent,
    actionButtonProps,
    addCancelButton,
    onCancelButtonClicked,
    infoTitle,
  } = props;

  const wizardsCommonTranslations = useWizardsCommonTranslations();

  const actionButton = useMemo(() => {
    if (actionButtonProps) {
      return (
        <CommonActionButton
          style={stylingForActionButtons}
          disabled={disableInputs}
          onClick={actionButtonProps.onClick}
        >
          {actionButtonProps.title}
        </CommonActionButton>
      );
    } else {
      return null;
    }
  }, [actionButtonProps, disableInputs]);

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
      return (
        <HtmlTooltip enterTouchDelay={50} leaveTouchDelay={4000} title={infoTitle} arrow interactive>
          <HelpOutlineIcon />
        </HtmlTooltip>
      );
    } else {
      return null;
    }
  }, [infoTitle]);

  const hasMessage = message && message.length > 0;
  const hasSubMessage = subMessage && subMessage.length > 0;

  // TODO : ORL : Fix centering of texts
  return (
    <WizardContent data-testid={contentTestId}>
      <Grid container item direction={'row'} justify={'center'} alignItems={'center'}>
        <Typography variant={'h5'} style={{ fontWeight: 'bold' }}>
          {titleContent}
        </Typography>
        {infoTooltippedIcon}
      </Grid>
      {/* Message */}
      <Grid item hidden={!hasMessage}>
        <Typography variant={'body1'}>{message}</Typography>
      </Grid>

      {/* Sub Message */}
      <Grid item hidden={!hasSubMessage}>
        <Typography variant={'body2'}>{subMessage}</Typography>
      </Grid>

      <Grid item>{innerContent}</Grid>
      <Grid item container justify={'center'} spacing={2}>
        {addCancelButton && (
          <Grid item>
            <CommonActionButton style={stylingForActionButtons} onClick={onCancelButtonClicked}>
              {wizardsCommonTranslations('action_close')}
            </CommonActionButton>
          </Grid>
        )}
        <Grid item>{actionButton}</Grid>
      </Grid>
    </WizardContent>
  );
});
