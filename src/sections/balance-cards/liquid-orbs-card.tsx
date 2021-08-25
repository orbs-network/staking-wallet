import React, { FC } from 'react';
import { observer } from 'mobx-react';
import BalanceCard from '../../components/balance-card/index';
import { UseBoolean } from 'react-hanger';
import { fullOrbsFromWeiOrbsString } from '../../cryptoUtils/unitConverter';
import { useBalancesSectionTranslations } from '../../translations/translationsHooks';
import { useOrbsAccountStore } from '../../store/storeHooks';

interface IProps {
  showStakingModal: UseBoolean;
}

const LiquidOrbsCard: FC<IProps> = observer(({ showStakingModal }) => {
  const balancesSectionTranslations = useBalancesSectionTranslations();
  const { liquidOrbs, doneLoading } = useOrbsAccountStore();
  const liquidOrbsAsString = fullOrbsFromWeiOrbsString(liquidOrbs);
  return (
    <BalanceCard
      title={balancesSectionTranslations('title_unstakedOrbsInYourWallet')}
      actionButtonTitle={balancesSectionTranslations('action_stakeYourTokens')}
      actionButtonActive={!!liquidOrbs}
      onActionButtonPressed={showStakingModal.setTrue}
      amount={liquidOrbsAsString}
      balanceCardTestId={'balance_card_liquid_orbs'}
      showFraction
      isLoading={!doneLoading}
    />
  );
});

export default LiquidOrbsCard;
