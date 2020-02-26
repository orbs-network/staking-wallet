import { useTranslation } from 'react-i18next';
import { useCallback } from 'react';
import { IBalancesSectionTranslations, ISectionTitlesTranslations } from './translationsTypes';

function useSpecificTypeSafeTFunction<T>(prefix: string) {
  const { t } = useTranslation();

  const tFunction = useCallback(
    (key: keyof T) => {
      return t(`${prefix}.${key}`);
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
