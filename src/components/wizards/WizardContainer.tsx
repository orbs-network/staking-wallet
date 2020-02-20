import React from 'react';
import styled from 'styled-components';
import { Grid } from '@material-ui/core';
import Color from 'color';
import { Theme } from '@material-ui/core/styles/createMuiTheme';

const CenteredContainerGrid = styled(Grid)(({ theme }) => {
  theme = theme as Theme;

  return {
    backgroundColor: Color(theme.palette.primary.dark)
      // .fade(0.1)
      .toString(),
    position: 'fixed',
    top: '35%',
    left: '50%',
    transform: 'translate(-50%, -35%)',
    width: '40em',
    maxWidth: '100%',
    border: '2px solid #E0E0E0',
    borderRadius: 5,
    boxShadow: theme.shadows[2],
    paddingTop: '0.5em',
    paddingBottom: '1.5em',
  };
});

export const WizardContainer = props => (
  <CenteredContainerGrid container direction={'column'} alignItems={'center'} {...props} />
);
