import React from 'react';
import { Button, Grid, Theme, Typography } from '@material-ui/core';
import styled from 'styled-components';
import { CommonDivider } from './base/CommonDivider';

const StyledGrid = styled('div')(styledProps => {
  return {
    backgroundColor: styledProps.theme.palette.primary.main,
    padding: '1em',
    paddingRight: '1.5em',
    paddingLeft: '1.5em',

    display: 'flex',
    flexDirection: 'column',
  };
});

interface IProps {
  title: string;
  amount: number;
  actionButtonTitle: string;
  actionButtonActive: boolean;
  onActionButtonPressed: () => void;

  // Testing
  testIdAmount?: string;
}

// TODO : O.L : Change this component to use Card.

export const BalanceCard: React.FC<IProps> = (props: IProps) => {
  const { title, amount, actionButtonTitle, actionButtonActive, onActionButtonPressed, testIdAmount } = props;

  return (
    <StyledGrid>
      <Typography variant={'caption'}>{title}</Typography>

      <CommonDivider />

      <Typography data-testid={testIdAmount} variant={'h6'}>{amount.toLocaleString()}</Typography>

      <Button color={'secondary'} variant={'contained'} disabled={!actionButtonActive} onClick={onActionButtonPressed}>
        {actionButtonTitle}
      </Button>
    </StyledGrid>
  );
};
