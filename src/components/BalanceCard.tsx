import React from 'react';
import { Button, Grid, Theme, Typography, Paper } from '@material-ui/core';
import styled from 'styled-components';
import { CommonDivider } from './base/CommonDivider';
import { CommonActionButton } from './base/CommonActionButton';
import { useStringOrElement } from './hooks/commonHooks';

const StyledGrid = styled(Paper)`
  padding: 1em;
  padding-right: 1.5em;
  padding-left: 1.5em;
  display: flex;
  flex-direction: column;
`;

interface IProps {
  title: string | React.ElementType;
  amount: number;
  actionButtonTitle: string;
  actionButtonActive: boolean;
  onActionButtonPressed: () => void;

  // Testing
  balanceCardTestId?: string;
}

export const BalanceCard: React.FC<IProps> = (props: IProps) => {
  const { title, amount, actionButtonTitle, actionButtonActive, onActionButtonPressed, balanceCardTestId } = props;

  const titleElement = useStringOrElement(title);

  return (
    <StyledGrid data-testid={balanceCardTestId}>
      <Typography variant={'caption'}>{titleElement}</Typography>

      <CommonDivider />

      <Typography variant={'h6'} data-testid={'balance_text'}>
        {amount.toLocaleString()}
      </Typography>

      <CommonActionButton fullWidth={true} disabled={!actionButtonActive} onClick={onActionButtonPressed}>
        {actionButtonTitle}
      </CommonActionButton>
    </StyledGrid>
  );
};
