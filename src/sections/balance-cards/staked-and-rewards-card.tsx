import React, { FC, useMemo } from 'react';
import { observer } from 'mobx-react';
import { BalanceCard } from '../../components/BalanceCard';
import { fullOrbsFromWeiOrbsString } from '../../cryptoUtils/unitConverter';
import stakingUtil from '../../utils/stakingUtil';
import BalanceTooltip from './components/balance-tooltip';
import { UseBoolean } from 'react-hanger';
import { numberToString } from '../../utils/numberUtils';
interface IProps {
  stakedOrbs: bigint;
  rewardsBalance: number;
  hasOrbsToWithdraw: boolean;
  showCannotUnstakeNowSnackbar: UseBoolean;
  showUnStakingModal: UseBoolean;
  title: string;
  stakeTitle: string;
  pendingRewardsTitle: string;
  actionButtonTitle: string;
}

const StakedAndRewardsCard: FC<IProps> = observer(
  ({
    stakedOrbs,
    rewardsBalance,
    hasOrbsToWithdraw,
    showCannotUnstakeNowSnackbar,
    showUnStakingModal,
    title,
    stakeTitle,
    pendingRewardsTitle,
    actionButtonTitle,
  }) => {
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
      numberToString(rewardsBalance),
    );
    return (
      <BalanceCard
        title={title}
        toolTipTitle={
          <BalanceTooltip
            stakeTitle={stakeTitle}
            stakedOrbs={stakedOrbsAsString}
            rewardsBalance={numberToString(rewardsBalance)}
            pendingRewardsTitle={pendingRewardsTitle}
          />
        }
        amount={orbsToUnstakeAsString}
        actionButtonTitle={actionButtonTitle}
        actionButtonActive={!!stakedOrbs}
        onActionButtonPressed={onUnstakeTokensClicked}
        balanceCardTestId={'balance_card_staked_orbs'}
        showFraction
      />
    );
  },
);

export default StakedAndRewardsCard;
