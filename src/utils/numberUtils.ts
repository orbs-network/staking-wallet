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
