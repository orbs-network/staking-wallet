import web3 from 'web3';

export function fullOrbsFromWeiOrbs(weiOrbs?: bigint): number {
  if (!weiOrbs) return 0;
  return parseFloat(web3.utils.fromWei(weiOrbs.toString(), 'ether'));
}

export function weiOrbsFromFullOrbs(fullOrbs?: number): bigint {
  return BigInt(web3.utils.toWei(fullOrbs.toString(), 'ether'));
}
