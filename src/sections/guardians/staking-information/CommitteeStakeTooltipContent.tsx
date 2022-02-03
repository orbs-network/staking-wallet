import React from 'react';
import { Box, Typography } from '@material-ui/core';
import clsx from 'clsx';
import { ICommitteeEffectiveStakeByChain } from '../../../services/v2/orbsNodeService/nodeResponseProcessing/RootNodeData';
import config from '../../../config';
import useStyles from './styles';

const CommitteeStakeTooltipContent = ({
  committeeStakeByChain,
}: {
  committeeStakeByChain: ICommitteeEffectiveStakeByChain;
}) => {
  const classes = useStyles();
  return (
    <>
      {Object.keys(committeeStakeByChain.chains).map(function (key, index) {
        const network = config.networks[key];
        const amount: number = committeeStakeByChain.chains[key];
        if (!network) {
          return null;
        }

        return (
          <Box key={key} className={clsx(classes.flex, classes.tooltipContentBox)}>
            <img className={classes.image} src={network.smallLogo} />
            <Typography>{`${network.name}: ${amount.toLocaleString()}`}</Typography>
          </Box>
        );
      })}
    </>
  );
};

export default CommitteeStakeTooltipContent;
