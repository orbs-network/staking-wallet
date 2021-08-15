import { Button, Grid, Theme, Typography, Paper, Tooltip } from '@material-ui/core';
import styled from 'styled-components';
import { makeStyles } from '@material-ui/core/styles';

export const StyledGrid = styled(Grid)(({ theme }) => ({
  // backgroundColor: 'rgba(33,33, 33, 0.55)',
  backgroundColor: 'rgba(47, 47, 47, 0.6)',
  paddingTop: '0.5em',
  paddingRight: '1.25em',
  paddingLeft: '1.25em',
  paddingBottom: '1.5em',

  transition: 'background-color 0.5s, color 0.5s',

  '@media (hover: hover)': {
    '&:hover': {
      backgroundColor: 'rgba(33,33, 33, 0.2)',
      color: theme.palette.secondary.main,
    },
  },
}));

export const useStyles = makeStyles((theme) => ({
  mainActionButton: {},
  secondaryActionButton: {
    padding: 0,
    fontSize: '100%',
    fontFamily: 'inherit',
    textTransform: 'none',
    boxSizing: 'border-box',
    transition: 'border 0.5s',
  },
}));
