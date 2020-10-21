import React from 'react';
import { Button, Grid, Theme, Typography, Paper, Tooltip } from '@material-ui/core';
import styled from 'styled-components';
import { CommonDivider } from './base/CommonDivider';
import { CommonActionButton } from './base/CommonActionButton';
import { useStringOrElement } from './hooks/commonHooks';

const StyledGrid = styled(Grid)(({ theme }) => ({
  // backgroundColor: 'rgba(33,33, 33, 0.55)',
  backgroundColor: 'rgba(47, 47, 47, 0.6)',
  paddingTop: '0.5em',
  paddingRight: '1.25em',
  paddingLeft: '1.25em',
  paddingBottom: '1.5em',
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

  // Testing
  balanceCardTestId?: string;
}

export const BalanceCard: React.FC<IProps> = (props: IProps) => {
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
    balanceCardTestId,
  } = props;

  const titleElement = useStringOrElement(title);

  const hasMainButton = actionButtonTitle || onActionButtonPressed;
  const hasSecondaryActionButton = secondaryActionButtonTitle || onSecondaryActionButtonPressed;

  const balanceItem = (
    <Grid item>
      <Typography variant={'h4'} style={{ marginBottom: '0.7em', marginTop: '0.2em' }} data-testid={'balance_text'}>
        {amount.toLocaleString()}
      </Typography>
    </Grid>
  );

  return (
    <StyledGrid container direction={'column'} data-testid={balanceCardTestId}>
      <Grid item>
        <Typography variant={'body'}>{titleElement}</Typography>
        <CommonDivider />
      </Grid>

      {toolTipTitle && <Tooltip title={toolTipTitle}>{balanceItem}</Tooltip>}
      {!toolTipTitle && balanceItem}

      {hasMainButton && (
        <Grid item>
          <CommonActionButton fullWidth={true} disabled={!actionButtonActive} onClick={onActionButtonPressed}>
            {actionButtonTitle}
          </CommonActionButton>
        </Grid>
      )}
    </StyledGrid>
  );
};
