import React from 'react';
import { Grid } from '@material-ui/core';
import styled from 'styled-components';
import { LoaderFigure, useLoaderStyles } from '../styles';
import { IBaseLoader } from '../types';
import CircularProgress from '@material-ui/core/CircularProgress';

const Container = styled(Grid)(({ theme }) => ({}));

const SpinnerLoader = ({ style }: IBaseLoader) => {
  const classes = useLoaderStyles();

  return (
    <Container>
      <CircularProgress disableShrink style={{ color: 'white' }} />
    </Container>
  );
};
export default SpinnerLoader;
