import { Box, Typography } from '@material-ui/core';
import React from 'react';
import useStyles from './styles';

interface IProps {
  img: string;
  name: string;
}
function NetworkItem({ img, name }: IProps) {
  const classes = useStyles();
  return (
    <Box className={classes.item}>
      {img && <img className={classes.logo} src={img} alt={name} />}
      <Typography style={{ fontWeight: 600 }} className={classes.name}>
        {name}
      </Typography>
    </Box>
  );
}

export default NetworkItem;
