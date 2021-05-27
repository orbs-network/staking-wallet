import web3 from 'web3';
import constants from '../constants/constants';
import { formatNumberToString } from '../utils/numberUtils';

export function fullOrbsFromWeiOrbs(weiOrbs?: bigint): number {
  if (!weiOrbs) return 0;
  return parseFloat(web3.utils.fromWei(weiOrbs.toString(), 'ether'));
}

export function weiOrbsFromFullOrbs(fullOrbs?: number): bigint {
  const value = formatNumberToString(fullOrbs, constants.numbersDecimalToInsertLimit);
  return BigInt(web3.utils.toWei(value, 'ether'));
}

export function weiOrbsFromFullOrbsString(fullOrbs?: string): bigint {
  const num = Number(fullOrbs);
  return BigInt(web3.utils.toWei(num.toString(), 'ether'));
}
