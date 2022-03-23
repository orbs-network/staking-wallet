import React, { FC } from 'react';
import { Typography } from '@material-ui/core';
import { useCommonStyles } from './styles';
import { Guardian } from '../../../../services/v2/orbsNodeService/systemState';
import { getStrokeColor, getStrokePercent } from '../../desktop/NewTable/utils';
import useTheme from '@material-ui/core/styles/useTheme';
import Stroke from '../../components/Stroke';

interface IProps {
  translation: any;
  guardian: Guardian | null;
  chain: number;
  isSelectedChain: boolean
}

const Participation = ({ guardian, translation, chain, isSelectedChain }: IProps) => {
  const commonClasses = useCommonStyles();
  // TODO : ORL : Make this color gradient

  const participationPercentage = guardian ? guardian.ParticipationPercentage : 0;


  const timePercentageText = guardian ? `${participationPercentage.toFixed(0)}%` : '-';
  const theme = useTheme()
  const strokeColor = getStrokeColor(participationPercentage, theme, chain, isSelectedChain);
  return (
    <div className={commonClasses.row}>
      <div className={commonClasses.rowName}>
        <Typography>{translation('columnHeader_participation')}</Typography>
      </div>

      <div className={commonClasses.rowContent}>
        {guardian ? (
          <>
           <Stroke color={strokeColor} percent={getStrokePercent(participationPercentage)} style={{ flex: 1, marginRight: 10 }} />
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
