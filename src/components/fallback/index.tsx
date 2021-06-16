import React, { FC } from 'react';
import { Button, Typography } from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';
const useStyles = makeStyles({
  container: {
    position: 'fixed',
    width: 'fit-content',
    height: 'auto',
    display: 'flex',
    flexDirection: 'column',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    border: '1px solid white',
    alignItems: 'center',
    padding: '40px',
    justifyContent: 'center',
  },
  btn: {
    marginTop: '40px',
    paddingLeft: '20px',
    paddingRight: '20px',
    background: 'white',
    color: 'black',
  },
});

const AppFallback = () => {
  const handleReload = () => {
    window.location.reload();
  };
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <Typography>Something went wrong....</Typography>
      <Button className={classes.btn} onClick={() => handleReload()}>
        try again
      </Button>
    </div>
  );
};

export default AppFallback;
