import React from 'react';
import { Box, Typography } from '@material-ui/core';
import clsx from 'clsx';
import config from '../../../config';
import useStyles from './styles';
import { ITotalChainStakeAmount } from '../../../store/types';

const TotalStakeTooltipContent = ({ totalStakeByChain }: { totalStakeByChain: ITotalChainStakeAmount[] }) => {
  const classes = useStyles();
  return (
    <>
      {totalStakeByChain.map((element, index) => {
        const network = config.networks[element.chain];
        if (!network) {
          return null;
        }
        return (
          <Box key={index} className={clsx(classes.flex, classes.tooltipContentBox)}>
            <img className={classes.image} src={network.smallLogo} />
            <Typography>{`${network.name}: ${element.totalSystemStakedTokens.toLocaleString()}`}</Typography>
          </Box>
        );
      })}
    </>
  );
};

export default TotalStakeTooltipContent;
