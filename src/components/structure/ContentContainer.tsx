import React from 'react';
import styled from 'styled-components';
import { Container } from '@material-ui/core';
import useTheme from '@material-ui/core/styles/useTheme';

export const ContentContainer = styled<typeof Container>((props) => {
  const theme = useTheme();
  const smallOrSmaller = theme.breakpoints.down['sm'];
  return <Container disableGutters={smallOrSmaller} {...props} />;
})(({ theme }) => {
  return {
    width: '100rem',
    maxWidth: '90%',

    [theme.breakpoints.down('sm')]: {
      maxWidth: 'calc(100% - 20px)',
    },
    [theme.breakpoints.up('sm')]: {},
    [theme.breakpoints.down('md')]: {
      // paddingRight: '3em',
      // paddingLeft: '3em',
    },
    [theme.breakpoints.up('md')]: {
      // paddingRight: '3em',
      // paddingLeft: '3em',
    },
    [theme.breakpoints.up('lg')]: {
      // paddingRight: '6em',
      // paddingLeft: '6em',
    },
    [theme.breakpoints.up('xl')]: {
      // paddingRight: '10em',
      // paddingLeft: '10em',
    },
  };
});
