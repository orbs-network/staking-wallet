import { Resource } from 'i18next';
import { ENGLISH_TEXTS } from './translations.en';
import { JAPANESE_TEXTS } from './translations.ja';
import { KOREAN_TEXTS } from './translations.ko';

export const resources: Resource = {
  en: {
    translation: ENGLISH_TEXTS,
  },
  jp: {
    translation: JAPANESE_TEXTS,
  },
  ko: {
    translation: KOREAN_TEXTS,
  },
};
