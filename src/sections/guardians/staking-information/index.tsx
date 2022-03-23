import { Box, Grid, GridJustification, Typography, useMediaQuery } from '@material-ui/core';
import React, { ReactNode } from 'react';

import { useTheme } from '@material-ui/core/styles';
import InformationItem from './Item';
import CommitteeStakeTooltipContent from './CommitteeStakeTooltipContent';
import { ICommitteeEffectiveStakeByChain } from '../../../services/v2/orbsNodeService/nodeResponseProcessing/RootNodeData';
import { useSectionsTitlesTranslations } from '../../../translations/translationsHooks';
import TotalStakeTooltipContent from './TotalStakeTooltipContent';
import { ITotalChainStakeAmount } from '../../../store/types';

interface IProps {
  totalStake: number;
  committeeStakeByChain: ICommitteeEffectiveStakeByChain;
  isLoading: boolean;
  totalStakeByChain: ITotalChainStakeAmount[];
}

function StakingInformation({ totalStake, totalStakeByChain, committeeStakeByChain, isLoading }: IProps) {
  const theme = useTheme();
  const largerThanMedium = useMediaQuery(theme.breakpoints.up('md'));
  const justification: GridJustification = largerThanMedium ? 'flex-end' : 'flex-start';

  const sectionTitlesTranslations = useSectionsTitlesTranslations();
  if (isLoading || !committeeStakeByChain) {
    return null;
  }
  return (
    <Grid container item direction={'row'} sm={12} md={8} justify={justification} spacing={4}>
      <InformationItem
        title={sectionTitlesTranslations('allGuardians_sideTitleTotalStake')}
        value={totalStake.toLocaleString()}
        tooltipContent={<TotalStakeTooltipContent totalStakeByChain={totalStakeByChain} />}
      />
      <InformationItem
        title={sectionTitlesTranslations('allGuardians_sideTitleCommitteeStake')}
        value={committeeStakeByChain.total.toLocaleString()}
        tooltipContent={<CommitteeStakeTooltipContent committeeStakeByChain={committeeStakeByChain} />}
      />
    </Grid>
  );
}

export default StakingInformation;
