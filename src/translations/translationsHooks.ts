import { useTranslation } from 'react-i18next';
import { useCallback } from 'react';
import { ISectionTitlesTranslations } from './translationsTypes';

export function useSectionsTitlesTranslations() {
  const { t } = useTranslation();

  const tFunction = useCallback(
    (key: keyof ISectionTitlesTranslations) => {
      return t(`sectionTitles.${key}`);
    },
    [t],
  );

  return tFunction;
}
