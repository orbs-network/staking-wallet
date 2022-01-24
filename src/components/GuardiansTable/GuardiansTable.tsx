import React, { memo, useContext } from 'react';
import useMobile from '../../hooks/useMobile';
import { IBaseTableProps } from './interfaces';
import { getSortedGuardians } from './util';
import DesktopTable from './desktop/NewTable/index';
import { IGuardiansDictionary } from '../../services/v2/orbsNodeService/OrbsNodeTypes';
import GuardiansMobile from './mobile/index';
import { MobXProviderContext } from 'mobx-react';
interface IProps extends IBaseTableProps {
  allChainsGuardians: { [key: string]: IGuardiansDictionary };
}

const GuardiansTable = (props: IProps) => {
  const [isMobile] = useMobile();
  const tableProps = {
    committeeMembers: props.committeeMembers,
    guardiansToDelegatorsCut: props.guardiansToDelegatorsCut,
    onGuardianSelect: props.onGuardianSelect,
    selectedGuardian: props.selectedGuardian,
    guardianSelectionMode: props.guardianSelectionMode,
    disableSelection: props.disableSelection,
    sortedGuardians: getSortedGuardians(Object.values(props.allChainsGuardians), props.selectedGuardian),
    tableTitle: props.tableTitle,
    densePadding: props.densePadding,
    isGuardian: props.isGuardian,
    mainAddress: props.mainAddress,
    selectedChain: props.selectedChain,
    minSelfStakePercentMille: props.minSelfStakePercentMille,
  };
  return isMobile ? <GuardiansMobile {...tableProps} /> : <DesktopTable {...tableProps} />;
};

export default GuardiansTable;
