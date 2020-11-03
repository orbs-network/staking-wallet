import React, { useMemo, useRef } from 'react';
import { Button, Grid, Theme, Typography, Paper, Tooltip } from '@material-ui/core';
import styled from 'styled-components';
import { CommonDivider } from './base/CommonDivider';
import { CommonActionButton } from './base/CommonActionButton';
import { useStringOrElement } from './hooks/commonHooks';
import useHover from '@react-hook/hover';
import { makeStyles } from '@material-ui/core/styles';
import useTheme from '@material-ui/core/styles/useTheme';
import AnimatedNumber from 'animated-number-react';

const StyledGrid = styled(Grid)(({ theme }) => ({
  // backgroundColor: 'rgba(33,33, 33, 0.55)',
  backgroundColor: 'rgba(47, 47, 47, 0.6)',
  paddingTop: '0.5em',
  paddingRight: '1.25em',
  paddingLeft: '1.25em',
  paddingBottom: '1.5em',

  transition: 'background-color 0.5s, color 0.5s',

  '@media (hover: hover)': {
    '&:hover': {
      backgroundColor: 'rgba(33,33, 33, 0.2)',
      color: theme.palette.secondary.main,
    },
  },
}));

const useStyles = makeStyles((theme) => ({
  mainActionButton: {},
  secondaryActionButton: {
    padding: 0,
    fontSize: '100%',
    fontFamily: 'inherit',
    textTransform: 'none',
    boxSizing: 'border-box',
    transition: 'border 0.5s',
  },
}));

interface IProps {
  title: string | React.ElementType;
  toolTipTitle?: string | React.ElementType;
  amount: number;

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
}

export const BalanceCard: React.FC<IProps> = (props: IProps) => {
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
  } = props;

  const theme = useTheme();
  const hoverTargetRef = useRef();
  const isHovering = useHover(hoverTargetRef);
  const titleElement = useStringOrElement(title);

  const hasMainButton = actionButtonTitle || onActionButtonPressed;
  const hasSecondaryActionButton = secondaryActionButtonTitle || onSecondaryActionButtonPressed;

  const numberFormatOptions = useMemo<Intl.NumberFormatOptions>(() => {
    const options: Intl.NumberFormatOptions = {};

    if (showFraction) {
      options.maximumFractionDigits = 6;
    }

    return options;
  }, [showFraction]);

  const formatValue = (value: number) => value.toLocaleString(undefined, numberFormatOptions);

  const balanceItem = (
    <Grid item>
      <Typography variant={'h4'} style={{ marginBottom: '0.7em', marginTop: '0.2em' }} data-testid={'balance_text'}>
        {/*{amount.toLocaleString(undefined, numberFormatOptions)}*/}
        <AnimatedNumber value={amount} formatValue={formatValue} />
      </Typography>
    </Grid>
  );

  return (
    <StyledGrid container direction={'column'} data-testid={balanceCardTestId} ref={hoverTargetRef}>
      <Grid item container alignItems={'center'} justify={'space-between'} style={{ height: '2rem' }}>
        <Grid item>
          <Typography variant={'body1'}>{titleElement}</Typography>
        </Grid>
        {hasSecondaryActionButton && (
          <Grid item>
            <Button
              className={classes.secondaryActionButton}
              variant={isHovering ? 'outlined' : 'text'}
              style={isHovering ? { backgroundColor: 'rgba(33,33, 33, 1)' } : {}}
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

      {toolTipTitle && (
        <Tooltip placement={'right'} title={toolTipTitle} arrow>
          {balanceItem}
        </Tooltip>
      )}
      {!toolTipTitle && balanceItem}

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
    </StyledGrid>
  );
};
