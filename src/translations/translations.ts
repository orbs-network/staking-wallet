import { Resource } from 'i18next';
import { ENGLISH_TEXTS } from './translations.en';

export const resources: Resource = {
  en: {
    translation: ENGLISH_TEXTS,
  },
  jp: {
    translation: {
      fontFamily: 'Meiryo,Hiragino Kaku Gothic ProN,MS PGothic,sans-serif',
      'Guardians List': 'ガーディアンリスト',
    },
  },
  ko: {
    translation: {
      fontFamily: 'Montserrat',
      'Guardians List': '가디언 목록',
    },
  },
};
