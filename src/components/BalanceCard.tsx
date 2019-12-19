import React from 'react';
import { Button, Grid, Theme, Typography } from '@material-ui/core';
import styled from 'styled-components';
import { CommonDivider } from './base/CommonDivider';

const StyledGrid = styled(Grid)(theme => ({
  backgroundColor: theme.theme.palette.primary.main,
  padding: '1em',
}));

interface IProps {
  title: string;
  amount: number;
  buttonTitle: string;
}

export const BalanceCard: React.FC<IProps> = (props: IProps) => {
  const { title, amount, buttonTitle } = props;

  return (
    <StyledGrid item>
      <Typography variant={'caption'}>{title}</Typography>
      <br />
      <CommonDivider />
      <Typography variant={'h6'}>{amount.toLocaleString()}</Typography>
      <br />
      <Button color={'secondary'} variant={'contained'}>
        {buttonTitle}
      </Button>
    </StyledGrid>
  );
};
