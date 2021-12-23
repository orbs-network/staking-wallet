import React from 'react';
import useMobile from '../../hooks/useMobile';
import { Guardian } from '../../services/v2/orbsNodeService/systemState';
import { IBaseTableProps } from './interfaces';
import { getSortedGuardians } from './util';
import NewTable from './desktop/NewTable/index';
interface IProps extends IBaseTableProps {
  guardians: Guardian[];
}

export const GuardiansTable = React.memo<IProps>((props) => {
  const [isMobile] = useMobile();

  const tableProps = {
    allChainsGuardians: props.allChainsGuardians,
    committeeMembers: props.committeeMembers,
    guardiansToDelegatorsCut: props.guardiansToDelegatorsCut,
    onGuardianSelect: props.onGuardianSelect,
    selectedGuardian: props.selectedGuardian,
    guardianSelectionMode: props.guardianSelectionMode,
    disableSelection: props.disableSelection,
    sortedGuardians: getSortedGuardians(props.guardians, props.selectedGuardian),
    pageSize: Math.min(50, props.guardians.length),
    tableTitle: props.tableTitle,
    densePadding: props.densePadding,
    isGuardian: props.isGuardian,
    mainAddress: props.mainAddress,
  };

  // return isMobile ? <GuardiansMobile {...tableProps} /> : <GuardiansDesktop {...tableProps} />;
  return <NewTable {...tableProps} />;
});
