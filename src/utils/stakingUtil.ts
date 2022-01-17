import Big from 'big.js';

const isMaxBtnEnabled = (orbsAllowance: string, liquidOrbs: string, disableInputs: boolean): boolean => {
  if (!liquidOrbs || disableInputs) return false;
  const first = new Big(orbsAllowance || '0');
  const second = new Big(liquidOrbs);
  return !second.eq(first);
};

const isApproveEnabled = (orbsAllowance: string, liquidOrbs: string): boolean => {
  if (!liquidOrbs || liquidOrbs === '0') return false;
  const first = new Big(orbsAllowance);
  const second = new Big(liquidOrbs);
  return second.lte(first);
};

const addNumbersAsStrings = (str1: string, str2: string): string => {
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
  return result.toFixed(18);
};

const isSameAddress = (address1?: string, address2?: string) => {
  if (!address1 || !address2) {
    return false;
  }
  return address1.toLowerCase() === address2.toLowerCase();
};

const disableGuardianSelectionInTable = (
  mainAddress: string,
  newGuardian: string,
  selectedGuardian: string,
  isGuardian: boolean,
  allowClickOnSelectedGuardian?: boolean,
): boolean => {
  if (!isGuardian && allowClickOnSelectedGuardian) {
    return false;
  }

  const isAlreadyDelegatedTo = isSameAddress(newGuardian, selectedGuardian);
  if (!isGuardian && !isAlreadyDelegatedTo) {
    return false;
  }

  // if the user is guardian

  const theNewGuardianIsMyslef = isSameAddress(mainAddress, newGuardian);
  const alreadyDelegatedToMyself = isSameAddress(mainAddress, selectedGuardian);

  if (theNewGuardianIsMyslef) {
    return false;
  }
  return true;
};

const disableGuardianSelection = (
  mainAddress: string,
  newGuardian: string,
  selectedGuardian: string,
  isGuardian: boolean,
): boolean => {
  if (!isGuardian) {
    return false;
  }
  // if the user is guardian

  const theNewGuardianIsMyslef = isSameAddress(mainAddress, newGuardian);
  const alreadyDelegatedToMyself = isSameAddress(mainAddress, selectedGuardian);

  if (theNewGuardianIsMyslef && !alreadyDelegatedToMyself) {
    return false;
  }
  return true;
};

export default {
  isMaxBtnEnabled,
  isApproveEnabled,
  addNumbersAsStrings,
  isSameAddress,
  disableGuardianSelectionInTable,
  disableGuardianSelection,
};
