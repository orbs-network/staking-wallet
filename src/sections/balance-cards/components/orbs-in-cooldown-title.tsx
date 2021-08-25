import React, { FC } from 'react';
import { UseNumber } from 'react-hanger';
import { TimeLeftCounter } from '../../../components/timeCounter/TimeLeftCounter';

interface IProps {
  hasOrbsInCooldown: boolean;
  canWithdrawCooldownOrbs: any;
  cooldownReleaseTimestamp: any;
  rerenderNumber: UseNumber;
  noTokensInCooldownText: string;
  tokensInCooldownText: string;
  tokensReadyForWithdrawalText: string;
}

const OrbsCooldownTitle: FC<IProps> = ({
  hasOrbsInCooldown,
  canWithdrawCooldownOrbs,
  cooldownReleaseTimestamp,
  rerenderNumber,
  noTokensInCooldownText,
  tokensInCooldownText,
  tokensReadyForWithdrawalText,
}) => {
  if (!hasOrbsInCooldown) {
    return <>{noTokensInCooldownText}</>;
  }
  if (hasOrbsInCooldown && !canWithdrawCooldownOrbs) {
    return (
      <>
        {tokensInCooldownText}
        {' ('}
        <TimeLeftCounter onToMomentReached={rerenderNumber.increase} toTimestamp={cooldownReleaseTimestamp} />
        {')'}
      </>
    );
  }
  return <>{tokensReadyForWithdrawalText}</>;
};

export default OrbsCooldownTitle;
