import React from 'react';
import { Button, Grid, Theme, Typography, Paper } from '@material-ui/core';
import styled from 'styled-components';
import { CommonDivider } from './base/CommonDivider';

const StyledGrid = styled(Paper)`
  padding: 1em;
  padding-right: 1.5em;
  padding-left: 1.5em;
  display: flex;
  flex-direction: column;
`;

interface IProps {
  title: string;
  amount: number;
  actionButtonTitle: string;
  actionButtonActive: boolean;
  onActionButtonPressed: () => void;

  // Testing
  testIdAmount?: string;
}

export const BalanceCard: React.FC<IProps> = (props: IProps) => {
  const { title, amount, actionButtonTitle, actionButtonActive, onActionButtonPressed, testIdAmount } = props;

  return (
    <StyledGrid>
      <Typography variant={'caption'}>{title}</Typography>

      <CommonDivider />

      <Typography data-testid={testIdAmount} variant={'h6'}>
        {amount.toLocaleString()}
      </Typography>

      <Button color={'secondary'} variant={'contained'} disabled={!actionButtonActive} onClick={onActionButtonPressed}>
        {actionButtonTitle}
      </Button>
    </StyledGrid>
  );
};
