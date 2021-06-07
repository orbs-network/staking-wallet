import Big from 'big.js';
import constants from '../constants/constants';
import { addCommasToString } from './stringUtils';

export function enforceNumberInRange(value: number, minValue: number, maxValue: number): number {
  if (maxValue < minValue) {
    throw new Error(`Invalid numerical boundries of [${minValue}, ${maxValue}]`);
  }

  const bottomEnforced = Math.max(value, minValue);
  const bottomAndTopEnforced = Math.min(bottomEnforced, maxValue);
  return bottomAndTopEnforced;
}

export const handleNumberAsStringToDisplay = (numAsString: string, decimalsLimit: number, dots?: boolean) => {
  const [full, decimals] = numAsString.split('.');
  const showDots = dots && decimals && decimals.length > decimalsLimit;
  if (decimals) {
    const newDecimals = decimals.substring(0, decimalsLimit);
    return showDots ? `${addCommasToString(full)}.${newDecimals}...` : `${addCommasToString(full)}.${newDecimals}`;
  }
  return addCommasToString(full);
};

export const numberToString = (num: number) => {
  const res = num.toLocaleString(undefined, {
    maximumFractionDigits: constants.numbersDecimalToInsertLimit,
    minimumFractionDigits: 0,
  });
  return res.replace(/,/g, '');
};
