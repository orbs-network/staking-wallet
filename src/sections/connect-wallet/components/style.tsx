import Grid, { GridProps } from '@material-ui/core/Grid';
import styled from 'styled-components';
import { Theme } from '@material-ui/core';

export const WalletConnectionInnerGrid = styled(Grid)<GridProps>(({ theme }: { theme: Theme }) => ({
  // Look& Feel
  backgroundColor: 'rgba(47, 47, 47, 0.6)',
  borderRadius: '10%',
  boxShadow: `0px 0px 41px 12px ${theme.palette.secondary.dark}`,
  marginBottom: '50px',

  transition: '0.7s',

  '&:hover': {
    backgroundColor: 'rgba(47, 47, 47, 0.2)',
    boxShadow: `0px 0px 41px 12px ${theme.palette.secondary.light}`,
  },

  // Dimensions
  minWidth: 'fit-content',
  width: '40em',
  padding: '3em',

  [theme.breakpoints.down('sm')]: {
    padding: '1.5em',
    width: '80%',
    maxWidth: '80%',
  },
  [theme.breakpoints.up('sm')]: {
    paddingLeft: '9em',
    paddingRight: '9em',
  },
  [theme.breakpoints.up('md')]: {
    paddingLeft: '13em',
    paddingRight: '13em',
  },
}));
