import React from 'react';
import { Grid } from '@material-ui/core';
import styled from 'styled-components';

import { makeStyles } from '@material-ui/core/styles';
import useTheme from '@material-ui/core/styles/useTheme';
import { LoaderFigure } from './styles';
const Container = styled(Grid)(({ theme }) => ({}));

const useStyles = makeStyles((theme) => ({
  figure: {
    maxWidth: '80%',
    minHeight: '22px',
  },
}));

const AddressLoader = () => {
  const classes = useStyles();

  const theme = useTheme();

  return (
    <Container>
      <LoaderFigure className={classes.figure}></LoaderFigure>
    </Container>
  );
};
export default AddressLoader;
