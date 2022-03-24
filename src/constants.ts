export const EMPTY_ADDRESS = '0x0000000000000000000000000000000000000000';
export const TERMS_OF_SERVICE_URL = 'https://orbs.com/tetra-terms-of-use';
export const PRIVACY_POLICY_URL = 'https://orbs.com/tetra-privacy-policy';
export const NETWORK_QUERY_PARAM = 'chainId';

export const CHAINS = {
  polygon: 137,
  ethereum: 1,
  ropsten: 3,
  kovanTest: 42,
  rinkebyTest: 4,
  goerliTest: 5,
};
export const DEFAULT_CHAIN = CHAINS.ethereum;
export const CONTARCTS_NAMES = [
  'delegations',
  'staking',
  'stakingRewards',
  'guardiansRegistration',
  'committee',
  'elections',
];

export const POLYGON_BRIDGE_URL =''
export const ORBS_TELEGRAM = 'https://t.me/OrbsNetwork'
export const ALLOWANCE_APPROVAL_AMOUNT_TO_SET = '18446744073709551615';
export const hasInjectedProvider = (window as any).ethereum
