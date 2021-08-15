import React, { FC } from 'react';
import { observer } from 'mobx-react';
import BalanceCard from '../../components/balance-card/index';

import { useRewardsSectionTranslations } from '../../translations/translationsHooks';
import { numberToString } from '../../utils/numberUtils';
import { useOrbsAccountStore } from '../../store/storeHooks';

const TotalRewards = observer(() => {
  const rewardsSectionTranslations = useRewardsSectionTranslations();
  const { estimatedRewardsForNextWeek, doneLoading } = useOrbsAccountStore();

  return (
    <BalanceCard
      title={`${rewardsSectionTranslations('title_rewardsRate')} (${rewardsSectionTranslations(
        'title_quantity_orbsPerWeek',
      )})`}
      amount={numberToString(estimatedRewardsForNextWeek)}
      showFraction
      isLoading={!doneLoading}
    />
  );
});

export default TotalRewards;
