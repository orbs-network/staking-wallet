import { useTranslation } from 'react-i18next';
import { useCallback } from 'react';
import {
  IAlertsTranslations,
  IAppTranslations,
  IBalancesSectionTranslations,
  ICommonsTranslations,
  IConnectWalletSectionTranslations,
  ISectionTitlesTranslations,
  IWizardsCommonsTranslations,
} from './translationsTypes';
import { TFunction, TOptions } from 'i18next';

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

export function useConnectWalletSectionTranslations() {
  return useSpecificTypeSafeTFunction<IConnectWalletSectionTranslations>('connectWalletSection');
}

export function useWizardsCommonTranslations() {
  return useSpecificTypeSafeTFunction<IWizardsCommonsTranslations>('wizardsCommons');
}

export function useAlertsTranslations() {
  return useSpecificTypeSafeTFunction<IAlertsTranslations>('alerts');
}

export function useCommonsTranslations() {
  return useSpecificTypeSafeTFunction<ICommonsTranslations>('commons');
}
