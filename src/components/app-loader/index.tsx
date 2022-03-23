import { CircularProgress } from '@material-ui/core';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  container: {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loader: {
    color: 'white',
    zoom: 3,
  },
}));

function AppLoader() {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <CircularProgress className={classes.loader} />
    </div>
  );
}

export default AppLoader;
