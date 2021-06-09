import React, { FC, useMemo } from 'react';
import { observer } from 'mobx-react';
import { BalanceCard } from '../../components/BalanceCard';
import { TimeLeftCounter } from '../../components/timeCounter/TimeLeftCounter';
import { useNumber } from 'react-hanger';
import { useOrbsInCooldownState } from '../../store/storeStateHooks';
import { fullOrbsFromWeiOrbsString } from '../../cryptoUtils/unitConverter';

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

const OrbsInCooldownCard: FC<IProps> = observer(
  ({
    showWithdrawingModal,
    showRestakingModal,
    orbsInCoolDown,
    cooldownReleaseTimestamp,
    withdrawText,
    restakeText,
    noTokensInCooldownText,
    tokensInCooldownText,
    tokensReadyForWithdrawalText,
  }) => {
    const rerenderNumber = useNumber(0);

    const { hasOrbsInCooldown, canWithdrawCooldownOrbs } = useOrbsInCooldownState();
    const orbsInCoolDownAsString = fullOrbsFromWeiOrbsString(orbsInCoolDown);

    const { orbsInCooldownBoxButtonAction, orbsInCooldownBoxButtonText } = useMemo(() => {
      let orbsInCooldownBoxButtonAction;
      let orbsInCooldownBoxButtonText: string;

      if (hasOrbsInCooldown && canWithdrawCooldownOrbs) {
        orbsInCooldownBoxButtonAction = showWithdrawingModal;
        orbsInCooldownBoxButtonText = withdrawText;
      } else {
        orbsInCooldownBoxButtonAction = showRestakingModal;
        orbsInCooldownBoxButtonText = restakeText;
      }

      return {
        orbsInCooldownBoxButtonAction,
        orbsInCooldownBoxButtonText,
      };
    }, [
      canWithdrawCooldownOrbs,
      hasOrbsInCooldown,
      showRestakingModal,
      showWithdrawingModal,
      restakeText,
      withdrawText,
    ]);

    const { orbsInCooldownBoxTitle, orbsInCooldownBoxEnabled } = useMemo(() => {
      let orbsInCooldownBoxTitle;
      let orbsInCooldownBoxEnabled = true;

      // No Tokens in cooldown ? Disable the balance box
      if (!hasOrbsInCooldown) {
        orbsInCooldownBoxTitle = noTokensInCooldownText;
        orbsInCooldownBoxEnabled = false;
      } else if (hasOrbsInCooldown && !canWithdrawCooldownOrbs) {
        // We only want to show time left if there is some time left
        orbsInCooldownBoxTitle = () => (
          <>
            {tokensInCooldownText}
            {' ('}
            <TimeLeftCounter onToMomentReached={rerenderNumber.increase} toTimestamp={cooldownReleaseTimestamp} />
            {')'}
          </>
        );
      } else {
        // TODO : translate
        orbsInCooldownBoxTitle = tokensReadyForWithdrawalText;
      }

      return {
        orbsInCooldownBoxTitle,
        orbsInCooldownBoxEnabled,
      };
    }, [
      canWithdrawCooldownOrbs,
      hasOrbsInCooldown,
      cooldownReleaseTimestamp,
      rerenderNumber.increase,
      noTokensInCooldownText,
      tokensInCooldownText,
      tokensReadyForWithdrawalText,
    ]);

    return (
      <BalanceCard
        title={orbsInCooldownBoxTitle}
        actionButtonTitle={orbsInCooldownBoxButtonText}
        amount={orbsInCoolDownAsString}
        actionButtonActive={orbsInCooldownBoxEnabled}
        onActionButtonPressed={orbsInCooldownBoxButtonAction}
        balanceCardTestId={'balance_card_cool_down_orbs'}
        showFraction
      />
    );
  },
);

export default OrbsInCooldownCard;
