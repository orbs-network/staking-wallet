import React, { FC } from 'react';
import { observer } from 'mobx-react';
import { BalanceCard } from '../../components/BalanceCard';
import { UseBoolean } from 'react-hanger';
import { fullOrbsFromWeiOrbsString } from '../../cryptoUtils/unitConverter';

interface IProps {
  title: string;
  actionButtonTitle: string;
  liquidOrbs: bigint;
  showStakingModal: UseBoolean;
}

const LiquidOrbsCard: FC<IProps> = observer(({ title, actionButtonTitle, liquidOrbs, showStakingModal }) => {
  const liquidOrbsAsString = fullOrbsFromWeiOrbsString(liquidOrbs);

  return (
    <BalanceCard
      title={title}
      actionButtonTitle={actionButtonTitle}
      actionButtonActive={!!liquidOrbs}
      onActionButtonPressed={showStakingModal.setTrue}
      amount={liquidOrbsAsString}
      balanceCardTestId={'balance_card_liquid_orbs'}
      showFraction
    />
  );
});

export default LiquidOrbsCard;