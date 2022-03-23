import React, { FC } from 'react';
import { observer } from 'mobx-react';
import BalanceCard from '../../components/balance-card/index';

import { useRewardsSectionTranslations } from '../../translations/translationsHooks';
import { useOrbsAccountStore } from '../../store/storeHooks';
import Loaders from '../../components/loaders/loader-components';

const RewardsRate: FC = observer(() => {
  const rewardsSectionTranslations = useRewardsSectionTranslations();
  const { totalRewardedRewards, doneLoading } = useOrbsAccountStore();

  return (
    <BalanceCard
    LoaderComponent = {Loaders.BalanceCardSmaller}
      title={`${rewardsSectionTranslations('title_totalRewardsAwarded')}`}
      amount={totalRewardedRewards}
      showFraction
      isLoading={!doneLoading}
    />
  );
});

export default RewardsRate;
