import Grid, { GridProps } from '@material-ui/core/Grid';
import styled from 'styled-components';
import { Theme } from '@material-ui/core';

export const WalletConnectionInnerGrid = styled(Grid)<GridProps>(({ theme }: { theme: Theme }) => ({
  // Look& Feel
  backgroundColor: 'rgba(47, 47, 47, 0.6)',
  borderRadius: '10%',
  boxShadow: `0px 0px 41px 12px ${theme.chain.current.mainColor}`,
  marginBottom: '50px',

  transition: '0.7s',

  '&:hover': {
    backgroundColor: 'rgba(47, 47, 47, 0.2)',
    boxShadow: `0px 0px 41px 12px ${theme.chain.current.mainColor}`,
  },

  // Dimensions
  minWidth: 'fit-content',
  width: '40em',
  padding: '3em',

  [theme.breakpoints.down('sm')]: {
    padding: '1.5em',
    width: '100%',
    maxWidth: '95%',
    minWidth:'unset'
  },
  [theme.breakpoints.up('sm')]: {
    paddingLeft: '9em',
    paddingRight: '9em',
  },
  [theme.breakpoints.up('md')]: {
    paddingLeft: '8em',
    paddingRight: '8em',
  },
}));
