import React, { FC } from 'react';
import { Typography } from '@material-ui/core';
import { Line } from 'rc-progress';
import { IMobileSection } from '../../interfaces';
import { useCommonStyles } from './styles';

const Participation: FC<IMobileSection> = ({ guardian, guardiansTableTranslations }) => {
  const { ParticipationPercentage } = guardian;
  const commonClasses = useCommonStyles();
  // TODO : ORL : Make this color gradient
  const color = ParticipationPercentage <= 30 ? 'red' : ParticipationPercentage <= 80 ? 'yellow' : 'green';
  const timePercentageText = ParticipationPercentage.toFixed(0);
  return (
    <div className={commonClasses.row}>
      <div className={commonClasses.rowName}>
        <Typography>{guardiansTableTranslations('columnHeader_participation')}</Typography>
      </div>

      <div className={commonClasses.rowContent}>
        <Line
          percent={ParticipationPercentage}
          strokeWidth={2}
          strokeLinecap='square'
          trailColor='transparent'
          strokeColor={color}
          className={commonClasses.line}
        />
        <Typography className={commonClasses.lineText}>{timePercentageText}%</Typography>
      </div>
    </div>
  );
};
export default Participation;
