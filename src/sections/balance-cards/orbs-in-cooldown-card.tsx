import React, { FC, useMemo } from 'react';
import { observer } from 'mobx-react';
import { BalanceCard } from '../../components/BalanceCard';
import { useNumber } from 'react-hanger';
import { useOrbsInCooldownState } from '../../store/storeStateHooks';
import { fullOrbsFromWeiOrbsString } from '../../cryptoUtils/unitConverter';
import OrbsCooldownTitle from './components/orbs-in-cooldown-title';
interface IProps {
  showWithdrawingModal: (value: boolean) => void;
  showRestakingModal: (value: boolean) => void;
  orbsInCoolDown: bigint;
  cooldownReleaseTimestamp: any;
  withdrawText: string;
  restakeText: string;
  noTokensInCooldownText: string;
  tokensInCooldownText: string;
  tokensReadyForWithdrawalText: string;
}

const OrbsInCooldownCard: FC<IProps> = observer((props) => {
  console.log({ props });
  const { showWithdrawingModal, showRestakingModal, orbsInCoolDown, withdrawText, restakeText } = props;
  const rerenderNumber = useNumber(0);

  const { hasOrbsInCooldown, canWithdrawCooldownOrbs } = useOrbsInCooldownState();
  const orbsInCoolDownAsString = fullOrbsFromWeiOrbsString(orbsInCoolDown);

  const orbsCooldownTitle = OrbsCooldownTitle({
    hasOrbsInCooldown,
    canWithdrawCooldownOrbs,
    cooldownReleaseTimestamp: props.cooldownReleaseTimestamp,
    rerenderNumber,
    noTokensInCooldownText: props.noTokensInCooldownText,
    tokensInCooldownText: props.tokensInCooldownText,
    tokensReadyForWithdrawalText: props.tokensReadyForWithdrawalText,
  });

  const showWithdraw = hasOrbsInCooldown && canWithdrawCooldownOrbs;

  return (
    <BalanceCard
      title={orbsCooldownTitle}
      secondaryActionButtonActive={showWithdraw}
      onSecondaryActionButtonPressed={showWithdraw ? () => showWithdrawingModal(true) : null}
      actionButtonTitle={restakeText}
      secondaryActionButtonTitle={showWithdraw ? withdrawText : ''}
      amount={orbsInCoolDownAsString}
      actionButtonActive={hasOrbsInCooldown}
      onActionButtonPressed={() => showRestakingModal(true)}
      balanceCardTestId={'balance_card_cool_down_orbs'}
      showFraction
    />
  );
});

export default OrbsInCooldownCard;
