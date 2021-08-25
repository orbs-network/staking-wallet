import React from 'react';
import { Typography } from '@material-ui/core';
import useErrorStyles from '../styles';
import { IBaseError } from '../types';

const BaseError = ({ errorText }: IBaseError) => {
  const classes = useErrorStyles();
  return (
    <div className={classes.baseError}>
      <Typography className={classes.baseErrorText}>{errorText}</Typography>
    </div>
  );
};

export default BaseError;
