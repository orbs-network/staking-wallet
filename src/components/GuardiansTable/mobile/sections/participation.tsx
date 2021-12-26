import React, { FC } from 'react';
import { Typography } from '@material-ui/core';
import { Line } from 'rc-progress';
import { IMobileSection } from '../../interfaces';
import { useCommonStyles } from './styles';
import { Guardian } from '../../../../services/v2/orbsNodeService/systemState';

interface IProps {
  translation: any;
  guardian: Guardian | null;
}

const Participation = ({ guardian, translation }: IProps) => {
  const commonClasses = useCommonStyles();
  // TODO : ORL : Make this color gradient

  const participationPercentage = guardian ? guardian.ParticipationPercentage : null;

  const color = !participationPercentage
    ? ''
    : participationPercentage <= 30
    ? 'red'
    : participationPercentage <= 80
    ? 'yellow'
    : 'green';

  const timePercentageText = guardian ? `${participationPercentage.toFixed(0)}%` : '-';
  return (
    <div className={commonClasses.row}>
      <div className={commonClasses.rowName}>
        <Typography>{translation('columnHeader_participation')}</Typography>
      </div>

      <div className={commonClasses.rowContent}>
        {guardian ? (
          <>
            <Line
              percent={participationPercentage}
              strokeWidth={2}
              strokeLinecap='square'
              trailColor='transparent'
              strokeColor={color}
              className={commonClasses.line}
            />
            <Typography className={commonClasses.lineText}>{timePercentageText}</Typography>
          </>
        ) : (
          <Typography>-</Typography>
        )}
      </div>
    </div>
  );
};
export default Participation;
