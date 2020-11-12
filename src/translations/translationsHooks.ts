import { useTranslation } from 'react-i18next';
import { useCallback } from 'react';
import {
  IAlertsTranslations,
  IApprovableWizardStepTranslations,
  IAppTranslations,
  IBalancesSectionTranslations,
  ICommonsTranslations,
  IConnectWalletSectionTranslations,
  IGuardianChangingWizardTranslation,
  IGuardianSelectingWizardTranslation,
  IGuardiansTableTranslations,
  IRestakingWizardTranslation,
  IRewardsClaimingWizardTranslation,
  IRewardsSectionTranslations,
  ISectionTitlesTranslations,
  IStakingWizardTranslations,
  IUnstakingWizardTranslation,
  IWalletInfoSectionTranslations,
  IWithdrawingWizardTranslation,
  IWizardsCommonsTranslations,
} from './translationsTypes';
import { TOptions } from 'i18next';

function useSpecificTypeSafeTFunction<T>(prefix: keyof IAppTranslations) {
  const { t } = useTranslation();

  const tFunction = useCallback(
    (key: keyof T, options?: TOptions) => {
      return t(`${prefix}.${key}`, options);
    },
    [prefix, t],
  );

  return tFunction;
}

export function useSectionsTitlesTranslations() {
  return useSpecificTypeSafeTFunction<ISectionTitlesTranslations>('sectionTitles');
}

export function useBalancesSectionTranslations() {
  return useSpecificTypeSafeTFunction<IBalancesSectionTranslations>('balancesSection');
}

export function useRewardsSectionTranslations() {
  return useSpecificTypeSafeTFunction<IRewardsSectionTranslations>('rewardsSection');
}

export function useConnectWalletSectionTranslations() {
  return useSpecificTypeSafeTFunction<IConnectWalletSectionTranslations>('connectWalletSection');
}

export function useWalletInfoSectionTranslations() {
  return useSpecificTypeSafeTFunction<IWalletInfoSectionTranslations>('walletInfoSection');
}

export function useGuardiansTableTranslations() {
  return useSpecificTypeSafeTFunction<IGuardiansTableTranslations>('guardiansTable');
}

export function useWizardsCommonTranslations() {
  return useSpecificTypeSafeTFunction<IWizardsCommonsTranslations>('wizardsCommons');
}

export function useApprovableWizardStepTranslations() {
  return useSpecificTypeSafeTFunction<IApprovableWizardStepTranslations>('approvableWizardStep');
}

export function useStakingWizardTranslations() {
  return useSpecificTypeSafeTFunction<IStakingWizardTranslations>('stakingWizard');
}

export function useGuardianChangingWizardTranslations() {
  return useSpecificTypeSafeTFunction<IGuardianChangingWizardTranslation>('guardianChangingWizard');
}

export function useGuardianSelectingWizardTranslations() {
  return useSpecificTypeSafeTFunction<IGuardianSelectingWizardTranslation>('guardianSelectingWizard');
}

export function useRestakingWizardTranslations() {
  return useSpecificTypeSafeTFunction<IRestakingWizardTranslation>('restakingWizard');
}

export function useUnstakingWizardTranslations() {
  return useSpecificTypeSafeTFunction<IUnstakingWizardTranslation>('unstakingWizard');
}

export function useWithdrawingWizardTranslations() {
  return useSpecificTypeSafeTFunction<IWithdrawingWizardTranslation>('withdrawingWizard');
}

export function useRewardsClaimingWizardTranslations() {
  return useSpecificTypeSafeTFunction<IRewardsClaimingWizardTranslation>('rewardsClaimingWizard');
}

export function useAlertsTranslations() {
  return useSpecificTypeSafeTFunction<IAlertsTranslations>('alerts');
}

export function useCommonsTranslations() {
  return useSpecificTypeSafeTFunction<ICommonsTranslations>('commons');
}
