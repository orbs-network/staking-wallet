import React from 'react';
import { Grid } from '@material-ui/core';
import styled from 'styled-components';
import { CommonDivider } from '../../base/CommonDivider';
import { LoaderFigure, useLoaderStyles } from '../styles';
import { IBaseLoader } from '../types';
const StyledGrid = styled(Grid)(({ theme }) => ({
  backgroundColor: 'rgba(47,47,47,0.6)',
  padding: '20px',
  height: '500px',
  width: '100%',
  transition: 'background-color 0.5s, color 0.5s',
  position: 'relative',
  top: '0px',
  left: '0px',
}));

const GuardiansLoader = ({ style }: IBaseLoader) => {
  const classes = useLoaderStyles();

  return (
    <StyledGrid container direction={'column'}>
      <Grid item container alignItems={'center'} justify={'space-between'} style={{ height: '2rem' }}>
        <LoaderFigure className={classes.guardiansbigFigure}></LoaderFigure>
      </Grid>
      <CommonDivider />
      <LoaderFigure className={classes.guardiansMediumFigure}></LoaderFigure>
      <LoaderFigure className={classes.guardianSmallFigure}></LoaderFigure>
      <LoaderFigure className={classes.guardianSmallFigure}></LoaderFigure>
    </StyledGrid>
  );
};
export default GuardiansLoader;
