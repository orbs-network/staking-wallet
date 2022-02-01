import React, { useRef } from 'react';
import { Button, Grid, Typography, Tooltip } from '@material-ui/core';
import { CommonDivider } from '../base/CommonDivider';
import { CommonActionButton } from '../base/CommonActionButton';
import { useStringOrElement } from '../hooks/commonHooks';
import BaseLoader from '../loaders';
import Loaders from '../loaders/loader-components/index';
import BalanceCardCounters from './components/counters';
import { StyledGrid, useStyles } from './styles';
import { HtmlTooltip } from '../base/HtmlTooltip';

interface IProps {
  title: string | React.ElementType | JSX.Element;
  toolTipTitle?: string | React.ElementType | JSX.Element;
  amount: string;
  warning?: string;
  // Action buttons (main + secondary)
  actionButtonTitle?: string;
  onActionButtonPressed?: () => void;
  actionButtonActive?: boolean;

  secondaryActionButtonTitle?: string;
  onSecondaryActionButtonPressed?: () => void;
  secondaryActionButtonActive?: boolean;

  // Display
  showFraction?: boolean;

  // Testing
  balanceCardTestId?: string;
  isLoading?: boolean;
}

const BalanceCard = (props: IProps) => {
  const {
    title,
    toolTipTitle,
    amount,
    actionButtonTitle,
    onActionButtonPressed,
    actionButtonActive,
    secondaryActionButtonTitle,
    onSecondaryActionButtonPressed,
    secondaryActionButtonActive,
    showFraction,
    balanceCardTestId,
    isLoading,
    warning,
  } = props;
  const classes = useStyles({ warning });
  const titleElement = useStringOrElement(title);
  const hasMainButton = actionButtonTitle || onActionButtonPressed;
  const hasSecondaryActionButton = secondaryActionButtonTitle || onSecondaryActionButtonPressed;

  return (
    <StyledGrid container direction={'column'} data-testid={balanceCardTestId} className={classes.container}>
      <BaseLoader isLoading={isLoading} LoaderComponent={Loaders.BalanceCard}>
        <>
          <Grid item container alignItems={'center'} justify={'space-between'} style={{ height: '2rem' }}>
            <Grid item>
              <Typography className={classes.title} variant={'body1'}>
                {titleElement}
              </Typography>
            </Grid>
            {hasSecondaryActionButton && (
              <Grid item>
                <Button
                  className={classes.secondaryActionButton}
                  color={'secondary'}
                  onClick={onSecondaryActionButtonPressed}
                  disabled={!secondaryActionButtonActive}
                >
                  {secondaryActionButtonTitle}
                </Button>
              </Grid>
            )}
          </Grid>
          <CommonDivider />
          {toolTipTitle ? (
            <HtmlTooltip placement={'right'} title={toolTipTitle}>
              <div>
                <BalanceCardCounters isLoading={isLoading} amount={amount} />
              </div>
            </HtmlTooltip>
          ) : (
            <BalanceCardCounters isLoading={isLoading} amount={amount} />
          )}

          {hasMainButton && (
            <Grid item>
              <CommonActionButton fullWidth={true} disabled={!actionButtonActive} onClick={onActionButtonPressed}>
                {actionButtonTitle}
              </CommonActionButton>
            </Grid>
          )}
          {warning && <Typography className={classes.warning}>{warning}</Typography>}
        </>
      </BaseLoader>
    </StyledGrid>
  );
};

export default BalanceCard;
