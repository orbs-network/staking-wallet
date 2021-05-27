import constants from '../constants/constants';

export function enforceNumberInRange(value: number, minValue: number, maxValue: number): number {
  if (maxValue < minValue) {
    throw new Error(`Invalid numerical boundries of [${minValue}, ${maxValue}]`);
  }

  const bottomEnforced = Math.max(value, minValue);
  const bottomAndTopEnforced = Math.min(bottomEnforced, maxValue);
  return bottomAndTopEnforced;
}

export const numberWithCommas = (n: number) => {
  const parts = n.toString().split('.');
  return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (parts[1] ? '.' + parts[1] : '');
};

export const formatNumberToString = (
  value: number,
  limit: number | undefined = constants.numbersDecimalToInsertLimit,
  keepFormat?: boolean,
) => {
  return keepFormat
    ? value.toLocaleString(undefined, { maximumFractionDigits: limit, minimumFractionDigits: 0 })
    : value.toLocaleString(undefined, { maximumFractionDigits: limit, minimumFractionDigits: 0 }).replace(/,/g, '');
};

export const NumberToDisplayFormat = (value: number, decimalsLimit: number, decimalsToShow: number) => {
  const formattedNumber = formatNumberToString(value, decimalsLimit);
  const roundNumber = formattedNumber.split('.')[0];
  const decimalsAmount = formattedNumber.split('.')[1];

  if (decimalsAmount && decimalsAmount.length > decimalsToShow) {
    const newDecimals = decimalsAmount.substring(0, 3);

    return `${Number(roundNumber).toLocaleString()}.${newDecimals}...`;
  }
  return Number(formattedNumber).toLocaleString();
};
