import React, { useRef } from 'react';
import { Button, Grid, Typography, Tooltip } from '@material-ui/core';
import { CommonDivider } from '../base/CommonDivider';
import { CommonActionButton } from '../base/CommonActionButton';
import { useStringOrElement } from '../hooks/commonHooks';
import useHover from '@react-hook/hover';
import BaseLoader from '../loaders';
import Loaders from '../loaders/loader-components/index';
import BalanceCardCounters from './components/counters';
import { StyledGrid, useStyles } from './styles';

interface IProps {
  title: string | React.ElementType | JSX.Element;
  toolTipTitle?: string | React.ElementType | JSX.Element;
  amount: string;

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
  const classes = useStyles();
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
  } = props;

  const hoverTargetRef = useRef();
  const isHovering = useHover(hoverTargetRef);
  const titleElement = useStringOrElement(title);
  const hasMainButton = actionButtonTitle || onActionButtonPressed;
  const hasSecondaryActionButton = secondaryActionButtonTitle || onSecondaryActionButtonPressed;

  return (
    <StyledGrid container direction={'column'} data-testid={balanceCardTestId} ref={hoverTargetRef}>
      <BaseLoader isLoading={isLoading} LoaderComponent={Loaders.BalanceCard}>
        <>
          <Grid item container alignItems={'center'} justify={'space-between'} style={{ height: '2rem' }}>
            <Grid item>
              <Typography variant={'body1'}>{titleElement}</Typography>
            </Grid>
            {hasSecondaryActionButton && (
              <Grid item>
                <Button
                  className={classes.secondaryActionButton}
                  variant={isHovering ? 'outlined' : 'text'}
                  style={{
                    backgroundColor: isHovering ? 'rgba(33,33, 33, 1)' : '',
                    paddingLeft: '10px',
                    paddingRight: '10px',
                  }}
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
            <Tooltip placement={'right'} title={toolTipTitle} arrow>
              <div>
                <BalanceCardCounters isLoading={isLoading} amount={amount} />
              </div>
            </Tooltip>
          ) : (
            <BalanceCardCounters isLoading={isLoading} amount={amount} />
          )}

          {hasMainButton && (
            <Grid item>
              <CommonActionButton
                variant={isHovering ? 'outlined' : 'contained'}
                fullWidth={true}
                disabled={!actionButtonActive}
                onClick={onActionButtonPressed}
              >
                {actionButtonTitle}
              </CommonActionButton>
            </Grid>
          )}
        </>
      </BaseLoader>
    </StyledGrid>
  );
};

export default BalanceCard;
