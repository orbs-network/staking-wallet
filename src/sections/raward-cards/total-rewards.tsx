import React, { FC } from 'react';
import { observer } from 'mobx-react';
import BalanceCard from '../../components/balance-card/index';

import { useRewardsSectionTranslations } from '../../translations/translationsHooks';
import { useOrbsAccountStore } from '../../store/storeHooks';

const RewardsRate: FC = observer(() => {
  const rewardsSectionTranslations = useRewardsSectionTranslations();
  const { totalRewardedRewards, doneLoading } = useOrbsAccountStore();

  return (
    <BalanceCard
      title={`${rewardsSectionTranslations('title_totalRewardsAwarded')}`}
      amount={totalRewardedRewards.toString()}
      showFraction
      isLoading={!doneLoading}
    />
  );
});

export default RewardsRate;
