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

  const {
    guardians,
    selectedGuardian,
    guardianSelectionMode,
    onGuardianSelect,
    tableTitle,
    densePadding,
    disableSelection,
    guardiansToDelegatorsCut,
    committeeMembers,
  } = props;

  const tableProps = {
    committeeMembers,
    guardiansToDelegatorsCut,
    onGuardianSelect,
    selectedGuardian,
    guardianSelectionMode,
    disableSelection,
    sortedGuardians: getSortedGuardians(guardians, selectedGuardian),
    pageSize: Math.min(50, guardians.length),
    tableTitle,
    densePadding,
  };

  return isMobile ? <GuardiansMobile {...tableProps} /> : <GuardiansDesktop {...tableProps} />;
});
