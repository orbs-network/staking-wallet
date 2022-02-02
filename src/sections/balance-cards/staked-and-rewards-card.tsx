import React, { FC, useMemo } from 'react';
import { observer } from 'mobx-react';
import BalanceCard from '../../components/balance-card/index';
import { fullOrbsFromWeiOrbsString } from '../../cryptoUtils/unitConverter';
import stakingUtil from '../../utils/stakingUtil';
import BalanceTooltip from './components/balance-tooltip';
import { UseBoolean } from 'react-hanger';
import { useOrbsAccountStore } from '../../store/storeHooks';
import { useBalancesSectionTranslations } from '../../translations/translationsHooks';
import { formatStringAsNumber } from '../../utils/stringUtils';
import constants from '../../constants/constants';
interface IProps {
  showCannotUnstakeNowSnackbar: UseBoolean;
  showUnStakingModal: UseBoolean;
}

const StakedAndRewardsCard: FC<IProps> = observer(({ showCannotUnstakeNowSnackbar, showUnStakingModal }) => {
  const { stakedOrbs, rewardsBalance, hasOrbsToWithdraw, doneLoading } = useOrbsAccountStore();
  const balancesSectionTranslations = useBalancesSectionTranslations();

  const onUnstakeTokensClicked = useMemo(() => {
    if (hasOrbsToWithdraw) {
      return () => showCannotUnstakeNowSnackbar.setTrue();
    } else {
      return () => showUnStakingModal.setTrue();
    }
  }, [hasOrbsToWithdraw, showCannotUnstakeNowSnackbar, showUnStakingModal]);

  const stakedOrbsAsString = fullOrbsFromWeiOrbsString(stakedOrbs);

  const orbsToUnstakeAsString = stakingUtil.addNumbersAsStrings(
    fullOrbsFromWeiOrbsString(stakedOrbs),
    rewardsBalance.toString(),
  );

  return (
    <BalanceCard
      title={balancesSectionTranslations('title_stakedOrbsAndRewardsBalance')}
      toolTipTitle={
        <BalanceTooltip
          stakeTitle={balancesSectionTranslations('tooltipTitle_stakedOrbs')}
          stakedOrbs={formatStringAsNumber(stakedOrbsAsString, true, constants.numbersDecimalToDisplayLimit)}
          rewardsBalance={formatStringAsNumber(rewardsBalance.toString(), true, constants.numbersDecimalToDisplayLimit)}
          pendingRewardsTitle={balancesSectionTranslations('tooltipTitle_pendingRewards')}
        />
      }
      amount={orbsToUnstakeAsString}
      actionButtonTitle={balancesSectionTranslations('action_unstakeYourTokens')}
      actionButtonActive={!!stakedOrbs}
      onActionButtonPressed={onUnstakeTokensClicked}
      balanceCardTestId={'balance_card_staked_orbs'}
      showFraction
      isLoading={!doneLoading}
    />
  );
});

export default StakedAndRewardsCard;
