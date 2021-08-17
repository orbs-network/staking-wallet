import React, { FC } from 'react';
import { observer } from 'mobx-react';
import BalanceCard from '../../components/balance-card/index';

import { useRewardsSectionTranslations } from '../../translations/translationsHooks';
import { numberToString } from '../../utils/numberUtils';
import { useOrbsAccountStore } from '../../store/storeHooks';

const RewardsRate: FC = observer(() => {
  const rewardsSectionTranslations = useRewardsSectionTranslations();
  const { totalRewardedRewards, doneLoading } = useOrbsAccountStore();

  return (
    <BalanceCard
      title={`${rewardsSectionTranslations('title_totalRewardsAwarded')} (${rewardsSectionTranslations(
        'title_quantity_orbs',
      )})`}
      amount={numberToString(totalRewardedRewards)}
      showFraction
      isLoading={!doneLoading}
    />
  );
});

export default RewardsRate;
