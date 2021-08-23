import constants from '../constants/constants';
import { getNumberSeparators } from './numberUtils';

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

export const formatStringAsNumber = (str: string, limitDecimals?: boolean): string => {
  if (!str) return;
  const [full, decimals] = str.split('.');
  const { decimal } = getNumberSeparators();
  const num = parseInt(full).toLocaleString();
  if (limitDecimals && decimal && decimals.length > constants.numbersDecimalToDisplayLimit) {
    return `${num}${decimal}${decimals.substring(0, constants.numbersDecimalToDisplayLimit)}...`;
  } else {
    return `${num}${decimal}${decimals}`;
  }
};
