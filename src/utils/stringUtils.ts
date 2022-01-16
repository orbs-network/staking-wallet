import config from '../config';
import constants from '../constants/constants';

export function ensurePrefix(text: string, prefix: string): string {
  if (text.startsWith(prefix)) {
    return text;
  } else {
    return `${prefix}${text}`;
  }
}

export const checkIfCharactersIncludes = (characters: string, fullString: string): boolean => {
  return fullString.indexOf(characters) > -1;
};

export const formatStringAsNumber = (str: string, limitDecimals?: boolean, decimalsAmount?: number): string => {
  const limit = decimalsAmount || constants.numbersDecimalToDisplayLimit
  if (!str) return;
  const [full, decimals] = str.split('.');
  const { decimal } = config.numberSeparator;
  const num = parseInt(full).toLocaleString();
  if (!decimals) {
    return `${num}`;
  }
  if (limitDecimals && decimals.length > limit) {
    return `${num}${decimal}${decimals.substring(0, limit)}...`;
  }
  return `${num}${decimal}${decimals}`;
};
