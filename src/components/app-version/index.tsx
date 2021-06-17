import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  root: {
    fontSize: 12,
    textAlign: 'center',
  },
});

const AppVersion = () => {
  const classes = useStyles();
  return <div className={classes.root}>{process.env.VERSION || ''}</div>;
};

export default AppVersion;
