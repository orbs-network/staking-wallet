import React, { FC } from 'react';
import { observer } from 'mobx-react';
import BalanceCard from '../../components/balance-card/index';

import { useRewardsSectionTranslations } from '../../translations/translationsHooks';
import { useOrbsAccountStore } from '../../store/storeHooks';

interface IProps {
  onSecondaryActionButtonPressed: () => void;
}

const RewardsBalance = observer(({ onSecondaryActionButtonPressed }: IProps) => {
  const rewardsSectionTranslations = useRewardsSectionTranslations();
  const { rewardsBalance, doneLoading } = useOrbsAccountStore();
  return (
    <BalanceCard
      title={`${rewardsSectionTranslations('title_rewardsBalance')} (${rewardsSectionTranslations(
        'title_quantity_orbs',
      )})`}
      amount={rewardsBalance.toString()}
      secondaryActionButtonActive={rewardsBalance > 0}
      secondaryActionButtonTitle={rewardsSectionTranslations('action_claim')}
      onSecondaryActionButtonPressed={onSecondaryActionButtonPressed}
      showFraction
      isLoading={!doneLoading}
    />
  );
});

export default RewardsBalance;
