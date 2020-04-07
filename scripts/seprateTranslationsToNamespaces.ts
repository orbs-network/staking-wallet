import { ENGLISH_TEXTS } from '../src/translations/translations.en';
import { IAppTranslations } from '../src/translations/translationsTypes';
import * as fs from 'fs';
import * as path from 'path';

type TAppTranslationKeys = keyof IAppTranslations;
const NAMESPACES_TO_IGNORE: TAppTranslationKeys[] = ['fontFamily'];

const languageCode = 'en';
const OUT_PUT_FOLDER = `${__dirname}/../local/namespaces/${languageCode}`;

function divideToNamespaces(appTranslations: IAppTranslations) {
  // separate to namespaces
  const entries = Object.entries(appTranslations);
  const filteredEntries = entries.filter(
    ([key, translations]) => !NAMESPACES_TO_IGNORE.includes(key as TAppTranslationKeys),
  );

  for (const entry of filteredEntries) {
    const [namespace, translations] = entry;

    const filePath = path.join(OUT_PUT_FOLDER, `${namespace}.json`);
    fs.writeFileSync(filePath, JSON.stringify(translations));
  }
}

divideToNamespaces(ENGLISH_TEXTS);
