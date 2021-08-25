import React, { FC } from 'react';
import { Button, Typography } from '@material-ui/core';
import useErrorStyles from '../styles';

const AppFallback = () => {
  const handleReload = () => {
    window.location.reload();
  };
  const classes = useErrorStyles();
  return (
    <div className={classes.crashError}>
      <Typography>Something went wrong....</Typography>
      <Button className={classes.crashErrorBtn} onClick={() => handleReload()}>
        try again
      </Button>
    </div>
  );
};

export default AppFallback;
