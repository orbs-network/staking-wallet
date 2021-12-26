import { ICommitteeMemberData, IGuardiansDictionary } from '../../services/v2/orbsNodeService/OrbsNodeTypes';
import { ensurePrefix } from '../../utils/stringUtils';
import { Guardian } from '../../services/v2/orbsNodeService/systemState';
import { IBaseTableProps } from './interfaces';

export const compareGuardiansBySelectedAndThenStake = (
  a: IGuardiansDictionary,
  b: IGuardiansDictionary,
  selectedGuardianAddress = '',
) => {
  const selectedGuardianAddressLowerCase = selectedGuardianAddress.toLowerCase();
  if (a.EthAddress.toLowerCase() === selectedGuardianAddressLowerCase) {
    return -1;
  } else if (b.EthAddress.toLowerCase() === selectedGuardianAddressLowerCase) {
    return 1;
  } else {
    return b.EffectiveStake - a.EffectiveStake;
  }
};

export const getSortedGuardians = (guardians: IGuardiansDictionary[], selectedGuardian?: string) => {
  return guardians.slice().sort((a, b) => compareGuardiansBySelectedAndThenStake(a, b, selectedGuardian));
};

export const getCommitteeMemberData = (guardianEthAddress: string, committeeMembers: ICommitteeMemberData[]) => {
  const committeeMemberData = committeeMembers.find(
    (committeeMember) =>
      ensurePrefix(committeeMember.EthAddress, '0x').toLowerCase() === guardianEthAddress.toLowerCase(),
  );

  return committeeMemberData;
};

export const getWebsiteAddress = (url: string) => (url.toLowerCase().indexOf('http') === 0 ? url : `http://${url}`);

interface IProps extends IBaseTableProps {
  guardiansTableTranslations: any;
  theme: any;
  copyAddress: (value: string) => void;
}

export const getEffectiveStakeInUnits = (EffectiveStake: number): string => {
  return EffectiveStake > 1_000_000
    ? `${(EffectiveStake / 1_000_000).toFixed(2).replace(/[.,]00$/, '')} M`
    : `${(EffectiveStake / 1_000).toFixed(2).replace(/[.,]00$/, '')} K`;
};

export const getCapacityText = (Capacity: any, toFixed: number) => {

  try {
    return !isNaN(Capacity) ? `${Capacity.toFixed(toFixed)}%` : '-';
  } catch (error) {
    return '-';
  }
};

export const getCapacityColor = (Capacity: any) => {
  return Capacity <= 30 ? 'green' : Capacity <= 80 ? 'yellow' : 'red';
};
