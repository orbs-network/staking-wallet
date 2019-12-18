import { createMuiTheme, responsiveFontSizes } from '@material-ui/core';

export const baseTheme = responsiveFontSizes(
  createMuiTheme({
    palette: {
      primary: {
        main: '#0D0D0D',
      },
      text: {
        primary: '#FFFFFF',
        secondary: '#7B7B7B',
      }
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
