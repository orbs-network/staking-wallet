import { ICommitteeMemberData } from '../../services/v2/orbsNodeService/OrbsNodeTypes';
import { ensurePrefix } from '../../utils/stringUtils';
import { Guardian } from '../../services/v2/orbsNodeService/systemState';
import { IBaseTableProps } from './interfaces';

export const compareGuardiansBySelectedAndThenStake = (a: Guardian, b: Guardian, selectedGuardianAddress = '') => {
  const selectedGuardianAddressLowerCase = selectedGuardianAddress.toLowerCase();
  if (a.EthAddress.toLowerCase() === selectedGuardianAddressLowerCase) {
    return -1;
  } else if (b.EthAddress.toLowerCase() === selectedGuardianAddressLowerCase) {
    return 1;
  } else {
    return b.EffectiveStake - a.EffectiveStake;
  }
};

export const getSortedGuardians = (guardians: Guardian[], selectedGuardian?: string) => {
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

export const createTableProps = (props) => {
  const { guardians, selectedGuardian } = props;
  return {
    committeeMembers: props.committeeMembers,
    guardiansToDelegatorsCut: props.guardiansToDelegatorsCut,
    onGuardianSelect: props.onGuardianSelect,
    selectedGuardian,
    guardianSelectionMode: props.guardianSelectionMode,
    disableSelection: props.disableSelection,
    sortedGuardians: getSortedGuardians(guardians, selectedGuardian),
    pageSize: Math.min(50, guardians.length),
    tableTitle: props.tableTitle,
    densePadding: props.densePadding,
  };
};

interface IProps extends IBaseTableProps {
  guardiansTableTranslations: any;
  theme: any;
}
export const createDesktopTableProps = (props: IProps) => {
  return {
    committeeMembers: props.committeeMembers,
    guardiansToDelegatorsCut: props.guardiansToDelegatorsCut,
    onGuardianSelect: props.onGuardianSelect,
    selectedGuardian: props.selectedGuardian,
    guardianSelectionMode: props.guardianSelectionMode,
    disableSelection: props.disableSelection,
    guardiansTableTranslations: props.guardiansTableTranslations,
    theme: props.theme,
  };
};

export const getEffectiveStakeInUnits = (EffectiveStake: number): string => {
  return EffectiveStake > 1_000_000
    ? `${(EffectiveStake / 1_000_000).toFixed(2).replace(/[.,]00$/, '')} M`
    : `${(EffectiveStake / 1_000).toFixed(2).replace(/[.,]00$/, '')} K`;
};

export const getCapacityText = (Capacity: any, toFixed: number) => {
  return !isNaN(Capacity) ? `${Capacity.toFixed(toFixed)}%` : '--';
};

export const getCapacityColor = (Capacity: any) => {
  return Capacity <= 30 ? 'green' : Capacity <= 80 ? 'yellow' : 'red';
};
