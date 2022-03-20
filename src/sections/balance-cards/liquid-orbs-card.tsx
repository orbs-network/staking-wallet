import React, { FC, useCallback, useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import BalanceCard from '../../components/balance-card/index';
import { UseBoolean } from 'react-hanger';
import { fullOrbsFromWeiOrbsString } from '../../cryptoUtils/unitConverter';
import { useBalancesSectionTranslations } from '../../translations/translationsHooks';
import { useCryptoWalletIntegrationStore, useOrbsAccountStore } from '../../store/storeHooks';
import WarningTooltipContent from '../../components/tooltips/WarningTooltip/WarningTooltipContent';

interface IProps {
  showStakingModal: UseBoolean;
}

const LiquidOrbsCard: FC<IProps> = observer(({ showStakingModal }) => {
  const [showWarning, setShowWarning] = useState(false);
  const balancesSectionTranslations = useBalancesSectionTranslations();
  const { liquidOrbs, doneLoading, hasSelectedGuardian } = useOrbsAccountStore();
  const { mainAddress } = useCryptoWalletIntegrationStore();

  const liquidOrbsAsString = fullOrbsFromWeiOrbsString(liquidOrbs);
  const localStorageName = `UNSTAKED_ORBS_WARNING_${mainAddress}`;

  useEffect(() => {
    if (hasSelectedGuardian && Number(liquidOrbs) > 0) {
      const localStorageItem = localStorage.getItem(localStorageName);
      if (!localStorageItem) {
        setShowWarning(true);
      }
    } else {
      localStorage.setItem(localStorageName, JSON.stringify(true));
    }
  }, [hasSelectedGuardian, liquidOrbs]);

  const closeWarning = () => {
    setShowWarning(false);
    localStorage.setItem(localStorageName, JSON.stringify(true));
  };

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
      warning={
        showWarning && (
          <WarningTooltipContent
            text={balancesSectionTranslations('warning_unstakedTokensNotEarningRewards')}
            onClose={closeWarning}
          />
        )
      }
    />
  );
});

export default LiquidOrbsCard;
