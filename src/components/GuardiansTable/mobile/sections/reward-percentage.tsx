import React, { FC } from 'react';
import ColumnHeaderWithTooltip from '../../components/common-tooltip';
import { Typography, Tooltip } from '@material-ui/core';
import { Guardian } from '../../../../services/v2/orbsNodeService/systemState';
import { IMobileSection } from '../../interfaces';

interface IProps extends IMobileSection {
  guardiansToDelegatorsCut: { [guardianAddress: string]: number };
}

const Rewards: FC<IProps> = ({ guardian, guardiansToDelegatorsCut, guardiansTableTranslations }) => {
  const { EthAddress } = guardian;

  const hasData = guardiansToDelegatorsCut[EthAddress] != undefined;

  const percentageText = hasData ? `${guardiansToDelegatorsCut[EthAddress]}%` : '--';
  return (
    <div>
      <Typography>
        <ColumnHeaderWithTooltip
          headerText={guardiansTableTranslations('columnHeader_rewardsPercentageToDelegators')}
          tooltipText={guardiansTableTranslations('columnHeaderInfo_rewardsPercentageToDelegators', {
            minPercentage: 0,
            maxPercentage: 66.667,
          })}
        />
      </Typography>
      <Tooltip
        arrow
        title={
          <>
            <Typography>
              {guardiansTableTranslations('message_guardianGivesXPercentageToDelegators', {
                percentage: percentageText,
              })}
            </Typography>
          </>
        }
      >
        <Typography>{percentageText}</Typography>
      </Tooltip>
    </div>
  );
};

export default Rewards;
