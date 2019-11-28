import { makeStyles } from '@material-ui/core/styles';
import React from 'react';

const useStyles = makeStyles(theme => ({
  toolbarSpacer: theme.mixins.toolbar,
}));

export const HeaderSpacer = () => {
  const classes = useStyles({});

  return <div className={classes.toolbarSpacer} />;
};
