import React from 'react';
import { Grid } from '@material-ui/core';
import styled from 'styled-components';
import { CommonDivider } from '../../base/CommonDivider';
import { LoaderFigure } from '../styles';
import { useLoaderStyles } from '../styles';
import { IBaseLoader } from '../types';
const StyledGrid = styled(Grid)(({ theme }) => ({
  // backgroundColor: 'rgba(33,33, 33, 0.55)',

  height: '100%',
  width: '100%',
  transition: 'background-color 0.5s, color 0.5s',
  position: 'absolute',
  top: '0px',
  left: '0px',
}));

const BalanceCardLoaderSmaller = ({ style }: IBaseLoader) => {
  const classes = useLoaderStyles();

  return (
    <StyledGrid container direction={'column'}>
      <Grid item container alignItems={'center'} justify={'space-between'} style={{ height: '2rem' }}>
        <LoaderFigure className={classes.balaceCardtopFigure}></LoaderFigure>
      </Grid>
      <CommonDivider />
      <LoaderFigure className={classes.balanceCardSmallFigure}></LoaderFigure>
    </StyledGrid>
  );
};

export default BalanceCardLoaderSmaller;
