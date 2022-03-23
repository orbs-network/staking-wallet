import web3 from 'web3';

export function fullOrbsFromWeiOrbs(weiOrbs?: bigint): number {
  if (!weiOrbs) return 0;
  return parseFloat(web3.utils.fromWei(weiOrbs.toString(), 'ether'));
}

export function fullOrbsFromWeiOrbsString(weiOrbs?: bigint | string): string {
  if (!weiOrbs) return '0';
  return web3.utils.fromWei(weiOrbs.toString(), 'ether');
}

export function weiOrbsFromFullOrbs(fullOrbs?: string): bigint {
  return BigInt(web3.utils.toWei(fullOrbs, 'ether'));
}
