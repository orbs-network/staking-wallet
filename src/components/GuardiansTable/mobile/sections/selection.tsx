import React from 'react';
import { Guardian } from '../../../../services/v2/orbsNodeService/systemState';
import { EMPTY_ADDRESS } from '../../../../constants';
import { TGuardianSelectionMode } from '../../interfaces';
import { Typography } from '@material-ui/core';
import getGuardianSelectionCellContent from '../../components/guardian-selection-cell-content-mobile';
import { useCommonStyles } from './styles';
import stakingUtil from '../../../../utils/stakingUtil';

interface IProps {
  onGuardianSelect?: (guardian: Guardian) => void;
  selectedGuardian?: string;
  guardianSelectionMode: TGuardianSelectionMode;
  theme: any;
  disableSelection?: boolean;
  guardian: Guardian;
  isGuardian: boolean;
  mainAddress: string;
  isSelectedChain: boolean;
  translation: any;
}

const Selection = (props: IProps) => {
  const commonClasses = useCommonStyles();
  const {
    translation,
    onGuardianSelect,
    selectedGuardian,
    guardianSelectionMode,
    theme,
    disableSelection,
    guardian,
    isGuardian,
    mainAddress,
    isSelectedChain,
  } = props;
  const hasSelectedGuardian = !!selectedGuardian && selectedGuardian !== EMPTY_ADDRESS;
  const addSelectionColumn = hasSelectedGuardian || (onGuardianSelect && guardianSelectionMode === 'Select');
  if (!addSelectionColumn || !guardian || !isSelectedChain) return <></>;
  return (
    <div className={commonClasses.row}>
      <div className={commonClasses.rowName}>
        <Typography>{translation('columnHeader_selection')}</Typography>
      </div>

      {getGuardianSelectionCellContent({
        g: guardian,
        onGuardianSelect,
        selectedGuardian,
        guardiansTableTranslations: translation,
        guardianSelectionMode,
        isGuardian,
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
