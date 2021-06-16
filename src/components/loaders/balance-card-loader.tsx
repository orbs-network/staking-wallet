import React from 'react';
import { Grid } from '@material-ui/core';
import styled from 'styled-components';
import { CommonDivider } from '../base/CommonDivider';

import { makeStyles } from '@material-ui/core/styles';
import useTheme from '@material-ui/core/styles/useTheme';
import { LoaderFigure } from './styles';
const StyledGrid = styled(Grid)(({ theme }) => ({
  // backgroundColor: 'rgba(33,33, 33, 0.55)',

  height: '100%',
  width: '100%',
  transition: 'background-color 0.5s, color 0.5s',
  position: 'absolute',
  top: '0px',
  left: '0px',
}));

const useStyles = makeStyles((theme) => ({
  topFigure: {
    maxWidth: '60%',
  },
  bottomFigure: {
    maxWidth: '200px',
    marginTop: '0px',
  },
  lastFigure: {
    maxWidth: '100px',
    marginTop: '20px',
  },
}));

const BalanceCardLoader = () => {
  const classes = useStyles();

  const theme = useTheme();

  return (
    <StyledGrid container direction={'column'}>
      <Grid item container alignItems={'center'} justify={'space-between'} style={{ height: '2rem' }}>
        <LoaderFigure className={classes.topFigure}></LoaderFigure>
      </Grid>
      <CommonDivider />
      <LoaderFigure className={classes.bottomFigure}></LoaderFigure>
      <LoaderFigure className={classes.lastFigure}></LoaderFigure>
    </StyledGrid>
  );
};

export default BalanceCardLoader;
