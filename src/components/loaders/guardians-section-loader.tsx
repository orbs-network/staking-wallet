import React from 'react';
import { Grid } from '@material-ui/core';
import styled from 'styled-components';
import { CommonDivider } from '../base/CommonDivider';

import { makeStyles } from '@material-ui/core/styles';
import useTheme from '@material-ui/core/styles/useTheme';
import { LoaderFigure } from './styles';
const StyledGrid = styled(Grid)(({ theme }) => ({
  backgroundColor: 'rgba(47,47,47,0.6)',
  padding: '20px',
  height: '300px',
  width: '100%',
  transition: 'background-color 0.5s, color 0.5s',
  position: 'relative',
  top: '0px',
  left: '0px',
}));

const useStyles = makeStyles((theme) => ({
  topFigure: {
    maxWidth: '350px',
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

export default () => {
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
