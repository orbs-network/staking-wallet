import React from 'react';
import useMobile from '../../hooks/useMobile';
import { Guardian } from '../../services/v2/orbsNodeService/systemState';
import GuardiansDesktop from './desktop/index';
import { IBaseTableProps } from './interfaces';
import GuardiansMobile from './mobile/index';
import { getSortedGuardians } from './util';
interface IProps extends IBaseTableProps {
  guardians: Guardian[];
}

export const GuardiansTable = React.memo<IProps>((props) => {
  const [isMobile] = useMobile();

  const tableProps = {
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

  return isMobile ? <GuardiansMobile {...tableProps} /> : <GuardiansDesktop {...tableProps} />;
});
