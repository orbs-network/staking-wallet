import { Box, Typography } from '@material-ui/core';
import React, { useContext } from 'react';
import useStyles from './styles';
import { MobXProviderContext } from 'mobx-react';
import config from '../../config';

const ChainIndicator = () => {
  const { chainId } = useContext(MobXProviderContext);
  const classes = useStyles();
  const network = config.networks[chainId];
  if (!network) {
    return null;
  }
  return (
    <Box className={classes.container}>
      {network.logo && <img className={classes.logo} src={network.logo} alt='network logo' />}
      <Typography className={classes.name}>{network.name}</Typography>
    </Box>
  );
};

export default ChainIndicator;
