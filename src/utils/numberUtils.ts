export function enforceNumberInRange(value: number, minValue: number, maxValue: number): number {
  if (maxValue < minValue) {
    throw new Error(`Invalid numerical boundries of [${minValue}, ${maxValue}]`);
  }

  const bottomEnforced = Math.max(value, minValue);
  const bottomAndTopEnforced = Math.min(bottomEnforced, maxValue);
  return bottomAndTopEnforced;
}

export const getNumberSeparators = () => {
  const res = {
    decimal: '.',
    thousand: '',
  };

  const str = parseFloat('1234.56').toLocaleString();

  if (!str.match('1')) return res;

  res.decimal = str.replace(/.*4(.*)5.*/, '$1');
  res.thousand = str.replace(/.*1(.*)2.*/, '$1');

  return res;
};
