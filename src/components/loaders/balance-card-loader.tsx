import React from 'react';
import { Grid } from '@material-ui/core';
import styled from 'styled-components';
import { CommonDivider } from '../base/CommonDivider';

import { makeStyles } from '@material-ui/core/styles';
import useTheme from '@material-ui/core/styles/useTheme';

const StyledGrid = styled(Grid)(({ theme }) => ({
  // backgroundColor: 'rgba(33,33, 33, 0.55)',
  backgroundColor: 'rgba(47, 47, 47, 0.6)',
  paddingTop: '0.5em',
  paddingRight: '1.25em',
  paddingLeft: '1.25em',
  paddingBottom: '1.5em',
  position: 'absolute',
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

export const BalanceCardLoader = () => {
  const classes = useStyles();

  const theme = useTheme();

  return (
    <StyledGrid container direction={'column'}>
      <Grid item container alignItems={'center'} justify={'space-between'} style={{ height: '2rem' }}>
        <Grid item></Grid>
      </Grid>
      <CommonDivider />
    </StyledGrid>
  );
};
