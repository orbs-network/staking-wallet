import { createMuiTheme, responsiveFontSizes } from '@material-ui/core';

export const baseTheme = responsiveFontSizes(
  createMuiTheme({
    palette: {
      primary: {
        main: '#0D0D0D',
      },
    },
    overrides: {
      MuiContainer: {
        root: {
          backgroundColor: 'black',
        },
      },
    },
  }),
);

export const AppStyles = {};
