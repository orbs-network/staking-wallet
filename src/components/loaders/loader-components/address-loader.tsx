import React from 'react';
import { Grid } from '@material-ui/core';
import styled from 'styled-components';
import { LoaderFigure, useLoaderStyles } from '../styles';
import { IBaseLoader } from '../types';
const Container = styled(Grid)(({ theme }) => ({}));

const AddressLoader = ({ style }: IBaseLoader) => {
  const classes = useLoaderStyles();

  return (
    <Container>
      <LoaderFigure className={classes.addressLoaderFigure}></LoaderFigure>
    </Container>
  );
};
export default AddressLoader;
