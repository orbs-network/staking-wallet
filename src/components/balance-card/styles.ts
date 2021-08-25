import { Button, Grid, Theme, Typography, Paper, Tooltip } from '@material-ui/core';
import styled from 'styled-components';
import { makeStyles } from '@material-ui/core/styles';

export const StyledGrid = styled(Grid)(({ theme }) => ({
  backgroundColor: 'rgba(47, 47, 47, 0.6)',
  paddingTop: '0.5em',
  paddingRight: '1.25em',
  paddingLeft: '1.25em',
  paddingBottom: '1.5em',
  position: 'relative',
}));

export const useStyles = makeStyles({
  mainActionButton: {},
  secondaryActionButton: {
    padding: 0,
    fontSize: '100%',
    fontFamily: 'inherit',
    paddingLeft: '10px',
    paddingRight: '10px',
    textTransform: 'none',
    boxSizing: 'border-box',
    transition: 'border 0.2s',
    border: '1px solid transparent',
    ['@media (max-width:1300px)']: {
      fontSize: 12,
    },
    '&:hover': {
      border: '1px solid white',
    },
  },
  container: {
    ['@media (max-width:700px)']: {
      marginBottom: (props: any) => (props.warning ? 35 : 0),
    },
  },
  title: {
    ['@media (max-width:1300px)']: {
      fontSize: 14,
    },
  },
  warning: {
    fontSize: 14,
    color: 'red',
    position: 'absolute',
    top: 'calc(100% + 5px)',
    left: '0px',
  },
});
