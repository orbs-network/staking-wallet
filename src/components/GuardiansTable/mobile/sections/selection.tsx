import React from 'react';
import { Guardian } from '../../../../services/v2/orbsNodeService/systemState';
import { EMPTY_ADDRESS } from '../../../../constants';
import { ISelectionProps } from '../../interfaces';
import { Typography } from '@material-ui/core';
import getGuardianSelectionCellContent from '../../components/guardian-selection-cell-content';
interface IProps extends ISelectionProps {
  guardian: Guardian;
}

const Selection = (props: IProps) => {
  const {
    guardiansTableTranslations,
    onGuardianSelect,
    selectedGuardian,
    guardianSelectionMode,
    theme,
    disableSelection,
    guardian,
  } = props;
  const hasSelectedGuardian = !!selectedGuardian && selectedGuardian !== EMPTY_ADDRESS;
  const addSelectionColumn = hasSelectedGuardian || (onGuardianSelect && guardianSelectionMode === 'Select');
  if (!addSelectionColumn) return <></>;
  return (
    <div>
      <Typography>{guardiansTableTranslations('columnHeader_selection')}</Typography>
      {getGuardianSelectionCellContent({
        g: guardian,
        onGuardianSelect,
        selectedGuardian,
        guardiansTableTranslations,
        guardianSelectionMode,
        theme,
        disableSelection,
      })}
    </div>
  );
};

export default Selection;
