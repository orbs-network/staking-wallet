import React from 'react';
import styled from 'styled-components';
import { Grid } from '@material-ui/core';
import Color from 'color';
import { Theme } from '@material-ui/core/styles/createMuiTheme';

const CenteredContainerGrid = styled<typeof Grid>(Grid)(({ theme }) => {
  theme = theme as Theme;

  return {
    // Position
    position: 'fixed',
    top: '35%',
    left: '50%',
    transform: 'translate(-50%, -35%)',

    // Colors
    backgroundColor: Color(theme.palette.primary.dark)
      // .fade(0.1)
      .toString(),

    // Box Effect
    border: '1px solid #979797',
    borderRadius: 5,
    boxShadow: theme.shadows[2],

    // Handles width of wizards
    width: 'fit-content',
    maxWidth: '100%',
    [theme.breakpoints.up('sm')]: {
      minWidth: '50%',
      maxWidth: '80%',
    },
    [theme.breakpoints.up('lg')]: {
      minWidth: '40%',
      maxWidth: '80%',
    },
    [theme.breakpoints.up('xl')]: {
      minWidth: '30%',
      maxWidth: '80%',
    },

    // Keeps space between the contents and the border
    padding: '1.5em',
    [theme.breakpoints.up('md')]: {
      padding: '3em',
    },
  };
});

export const WizardContainer = props => (
  <CenteredContainerGrid container direction={'column'} justify={'space-around'} spacing={1} {...props} />
);
