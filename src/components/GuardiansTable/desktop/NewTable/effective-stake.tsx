import React, { memo } from 'react';
import { Typography, Tooltip } from '@material-ui/core';
import { getEffectiveStakeInUnits } from '../../util';
import { HtmlTooltip } from '../../../base/HtmlTooltip';

interface IProps {
  translation: any;
  selfStake: number;
  delegatedStake: number;
  effectiveStake: number;
  className?: string;

}

function EffectiveStake({ translation, selfStake, delegatedStake, effectiveStake, className = '' }: IProps) {
  return (
    <HtmlTooltip
      arrow
      title={
        <>
          <Typography>
            {translation('message_selfStake')}: {translation('xOrbs', { amount: selfStake?.toLocaleString() })}
          </Typography>

          <Typography>
            {translation('message_delegatedStake')}:{' '}
            {translation('xOrbs', { amount: delegatedStake?.toLocaleString() })}
          </Typography>
        </>
      }
    >
      <Typography className={className} style={{ width: 'fit-content' }}>{getEffectiveStakeInUnits(effectiveStake)}</Typography>
    </HtmlTooltip>
  );
}

export default EffectiveStake;
