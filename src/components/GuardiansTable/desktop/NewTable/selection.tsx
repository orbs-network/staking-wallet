import React from 'react';
import { Guardian } from '../../../../services/v2/orbsNodeService/systemState';
import { ISelectionProps } from '../../interfaces';
import getGuardianSelectionCellContent from '../../components/guardian-selection-cell-content';
import stakingUtil from '../../../../utils/stakingUtil';

interface IProps extends ISelectionProps {
  isGuardian: boolean;
  mainAddress: string;
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
    isGuardian,
    mainAddress,
    guardian,
  } = props;

  return (
    <>
      {getGuardianSelectionCellContent({
        g: guardian,
        onGuardianSelect,
        selectedGuardian,
        guardiansTableTranslations,
        guardianSelectionMode,
        theme,
        isGuardian,
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
    </>
  );
};

export default Selection;
