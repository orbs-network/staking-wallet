import React from 'react';
import { Guardian } from '../../../../services/v2/orbsNodeService/systemState';
import { EMPTY_ADDRESS } from '../../../../constants';
import { ISelectionProps } from '../../interfaces';
import { Typography } from '@material-ui/core';
import getGuardianSelectionCellContent from '../../components/guardian-selection-cell-content-mobile';
import { useCommonStyles } from './styles';
import stakingUtil from '../../../../utils/stakingUtil';

interface IProps extends ISelectionProps {
  guardian: Guardian;
  isGuardian: boolean;
  mainAddress: string;
}

const Selection = (props: IProps) => {
  const commonClasses = useCommonStyles();
  const {
    guardiansTableTranslations,
    onGuardianSelect,
    selectedGuardian,
    guardianSelectionMode,
    theme,
    disableSelection,
    guardian,
    isGuardian,
    mainAddress,
  } = props;
  const hasSelectedGuardian = !!selectedGuardian && selectedGuardian !== EMPTY_ADDRESS;
  const addSelectionColumn = hasSelectedGuardian || (onGuardianSelect && guardianSelectionMode === 'Select');
  if (!addSelectionColumn) return <></>;
  return (
    <div className={commonClasses.row}>
      <div className={commonClasses.rowName}>
        <Typography>{guardiansTableTranslations('columnHeader_selection')}</Typography>
      </div>

      {getGuardianSelectionCellContent({
        g: guardian,
        onGuardianSelect,
        selectedGuardian,
        guardiansTableTranslations,
        guardianSelectionMode,
        theme,
        disableSelection:
          disableSelection ||
          stakingUtil.disableGuardianSelectionInTable(
            mainAddress,
            guardian.EthAddress,
            selectedGuardian,
            isGuardian,
            guardianSelectionMode === 'Select',
          ),
      })}
    </div>
  );
};

export default Selection;
