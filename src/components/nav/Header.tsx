import { Typography } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import React from 'react';

const useStyles = makeStyles(theme => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
}));

export const Header = () => {
  const classes = useStyles({});

  return (
    <AppBar position='static' color='default' className={classes.appBar}>
      <Toolbar>
        <Typography>Orbs</Typography>
      </Toolbar>
    </AppBar>
  );
};
