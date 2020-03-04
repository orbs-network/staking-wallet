import React from 'react';
import styled from 'styled-components';
import { Container } from '@material-ui/core';

export const ContentContainer = styled<typeof Container>(props => <Container maxWidth={'xl'} {...props} />)(
  ({ theme }) => {
    return {
      [theme.breakpoints.down('sm')]: {},
      [theme.breakpoints.up('sm')]: {},
      [theme.breakpoints.up('md')]: {
        paddingRight: '2em',
        paddingLeft: '2em',
      },
      [theme.breakpoints.up('lg')]: {
        paddingRight: '5em',
        paddingLeft: '5em',
      },
    };
  },
);
