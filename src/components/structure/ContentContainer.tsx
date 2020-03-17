import React from 'react';
import styled from 'styled-components';
import { Container } from '@material-ui/core';

export const ContentContainer = styled<typeof Container>(props => <Container maxWidth={'xl'} {...props} />)(
  ({ theme }) => {
    return {
      [theme.breakpoints.down('sm')]: {},
      [theme.breakpoints.up('sm')]: {},
      [theme.breakpoints.up('md')]: {
        paddingRight: '3em',
        paddingLeft: '3em',
      },
      [theme.breakpoints.up('lg')]: {
        paddingRight: '6em',
        paddingLeft: '6em',
      },
      [theme.breakpoints.up('xl')]: {
        paddingRight: '10em',
        paddingLeft: '10em',
      },
    };
  },
);
