import Big from 'big.js';

const isMaxBtnEnabled = (orbsAllowance: string, liquidOrbs: string): boolean => {
  if (!liquidOrbs) return false;
  if (!orbsAllowance) return true;
  const first = new Big(orbsAllowance);
  const second = new Big(liquidOrbs);
  return !second.eq(first);
};

const isApproveEnabled = (orbsAllowance: string, liquidOrbs: string): boolean => {
  if (!liquidOrbs || liquidOrbs === '0') return false;
  const first = new Big(orbsAllowance);
  const second = new Big(liquidOrbs);
  return second.lte(first);
};

const addNumbersAsStrings = (str1: string, str2: string) => {
  console.log('test', str1, str2);
  if (str2 === '0') {
    return str1;
  }
  if (str1 === '0') {
    return str2;
  }
  if (str1 === '0' && str2 === '0') {
    return '0';
  }
  const first = new Big(str1);
  const second = new Big(str2);
  const result = first.plus(second);
  return result.valueOf();
};

export default {
  isMaxBtnEnabled,
  isApproveEnabled,
  addNumbersAsStrings,
};