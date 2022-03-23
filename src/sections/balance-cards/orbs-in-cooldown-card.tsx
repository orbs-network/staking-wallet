import React, { FC, useMemo } from 'react';
import { observer } from 'mobx-react';
import BalanceCard from '../../components/balance-card/index';
import { useNumber } from 'react-hanger';
import { useOrbsInCooldownState } from '../../store/storeStateHooks';
import { fullOrbsFromWeiOrbsString } from '../../cryptoUtils/unitConverter';
import OrbsCooldownTitle from './components/orbs-in-cooldown-title';
import { useOrbsAccountStore } from '../../store/storeHooks';
import { useBalancesSectionTranslations } from '../../translations/translationsHooks';
interface IProps {
  showWithdrawingModal: (value: boolean) => void;
  showRestakingModal: (value: boolean) => void;
}

const OrbsInCooldownCard: FC<IProps> = observer((props) => {
  const { orbsInCoolDown, cooldownReleaseTimestamp, doneLoading } = useOrbsAccountStore();
  const balancesSectionTranslations = useBalancesSectionTranslations();
  const { showWithdrawingModal, showRestakingModal } = props;
  const rerenderNumber = useNumber(0);

  const { hasOrbsInCooldown, canWithdrawCooldownOrbs } = useOrbsInCooldownState();
  const orbsInCoolDownAsString = fullOrbsFromWeiOrbsString(orbsInCoolDown);
  const orbsCooldownTitle = useMemo(
    () =>
      OrbsCooldownTitle({
        hasOrbsInCooldown,
        canWithdrawCooldownOrbs,
        cooldownReleaseTimestamp,
        rerenderNumber,
        noTokensInCooldownText: balancesSectionTranslations('title_noTokensInCooldown'),
        tokensInCooldownText: balancesSectionTranslations('title_tokensInCooldown'),
        tokensReadyForWithdrawalText: balancesSectionTranslations('title_tokensReadyForWithdrawal'),
      }),
    [balancesSectionTranslations, canWithdrawCooldownOrbs, cooldownReleaseTimestamp, hasOrbsInCooldown, rerenderNumber],
  );

  const showWithdraw = hasOrbsInCooldown && canWithdrawCooldownOrbs;

  return (
    <BalanceCard
      title={orbsCooldownTitle}
      secondaryActionButtonActive={showWithdraw}
      onSecondaryActionButtonPressed={showWithdraw ? () => showWithdrawingModal(true) : null}
      actionButtonTitle={balancesSectionTranslations('action_restakeYourTokens')}
      secondaryActionButtonTitle={showWithdraw ? balancesSectionTranslations('action_withdrawYourTokens') : ''}
      amount={orbsInCoolDownAsString}
      actionButtonActive={hasOrbsInCooldown}
      onActionButtonPressed={() => showRestakingModal(true)}
      balanceCardTestId={'balance_card_cool_down_orbs'}
      showFraction
      isLoading={!doneLoading}
    />
  );
});

export default OrbsInCooldownCard;
