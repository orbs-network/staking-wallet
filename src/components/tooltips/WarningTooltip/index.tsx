import React, { ReactElement, useEffect, useState } from 'react';

import { Box, Tooltip } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/styles';

interface IProps {
  children: ReactElement;
}

const useStyles = makeStyles({
  container: {
    background: '#FE3B30',
    position: 'absolute',
    top: '100%',
    left: 20,
    borderRadius: '20px',
    zIndex: 10
  },
  arrow: {
    position: 'absolute',
    width: 0,
    height: 0,
    borderLeft: '12px solid transparent',
    borderRight: '12px solid transparent',
    borderBottom: '12px solid #FE3B30',
    left: 0,
    top: -24,
  },
});

function WarningTooltip({ children }: IProps) {
  const classes = useStyles();
  return (
    <Box className={classes.container}>
      <figure className={classes.arrow}></figure>
      {children}
    </Box>
  );
}

export default WarningTooltip;
