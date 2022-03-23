import { createGlobalStyle } from 'styled-components';
import { blue } from '@material-ui/core/colors';
import responsiveFontSizes from '@material-ui/core/styles/responsiveFontSizes';
import { CHAINS, DEFAULT_CHAIN } from '../constants';
import { createMuiTheme } from '@material-ui/core/styles';

declare module '@material-ui/core/styles' {
  interface CustomTheme {
    chain: any;
  }

  interface Theme extends CustomTheme {}
  interface ThemeOptions extends CustomTheme {}
}

const COLOR1 = '#0D0D0D'; // dark gray

const PRIMARY_TEXT = '#dbdbdb';

const polygon = {
  mainColor: '#844FDA',
  strokeColors: {
    low: '#D70D0D',
    high: '#A857FF',
    disabled: '#311758',
  },
  textColor: '#ffffff',
  actionButtonBackground: '#844FDA',
};

const ethereum = {
  mainColor: '#03FCF5',
  strokeColors: {
    low: '#D70D0D',
    high: '#15F9FF',
    disabled: '#18302F',
  },
  textColor: 'rgba(0, 0, 0, 0.87)',
  actionButtonBackground: '#15F9FF',
};

const chainsCustomStyles = {
  [CHAINS.polygon]: polygon,
  [CHAINS.ethereum]: ethereum,
  [CHAINS.ropsten]: ethereum,
};

export const getTheme = (chain: number) => {
  const chainConfig = chainsCustomStyles[chain] || chainsCustomStyles[DEFAULT_CHAIN];
  return responsiveFontSizes(
    createMuiTheme({
      palette: {
        type: 'dark',
        primary: {
          main: COLOR1,
        },

        secondary: {
          main: chainConfig.mainColor,
        },
        background: {
          default: '#000000',
        },
      },
      typography: {
        fontFamily: 'Montserrat',
      },
      chain: {
        current: chainConfig,
        ...chainsCustomStyles,
      },

      overrides: {
        MuiPaper: {
          root: {
            backgroundColor: COLOR1,
          },
        },
        MuiTypography: {
          colorPrimary: {
            color: PRIMARY_TEXT,
          },
        },
        MuiLink: {
          root: {
            color: blue[500],
          },
        },
      },
    }),
  );
};

export const AppStyles = {};

/**
 * DEV_NOTE : This, together with the 'responsiveFontSizes' ensures responsiveness in the Typography and 'em/rem' sizes.
 */
export const GlobalStyleComponent = createGlobalStyle`
  body {
    @media (min-width: 1920px) {
      font-size: 20px;
    }

    @media (max-width: 1920px) {
      font-size: 18px;
    }

    @media (max-width: 1600px) {
      font-size: 16px;
    }

    @media (max-width: 1366px) {
      font-size: 14px;
    }

    @media (max-width: 1200px) {
      font-size: 12px;
    }

    @media (max-width: 1024px) {
      font-size: 10px;
    }

    @media (max-width: 768px) {
      font-size: 8px;
    }
  }
`;
