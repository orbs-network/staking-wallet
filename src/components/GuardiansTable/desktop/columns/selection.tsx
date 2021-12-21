import { Guardian } from '../../../../services/v2/orbsNodeService/systemState';
import { EMPTY_ADDRESS } from '../../../../constants';
import { IGroupedGuardian, ISelectionProps } from '../../interfaces';
import getGuardianSelectionCellContent from '../../components/guardian-selection-cell-content';
import stakingUtil from '../../../../utils/stakingUtil';

interface IProps extends ISelectionProps {
  isGuardian: boolean;
  mainAddress: string;
  guardian: Guardian;
}

const getSelectionColumn = (props: IProps) => {
  const {
    guardiansTableTranslations,
    onGuardianSelect,
    selectedGuardian,
    guardianSelectionMode,
    theme,
    disableSelection,
    isGuardian,
    mainAddress,
  } = props;

  const hasSelectedGuardian = !!selectedGuardian && selectedGuardian !== EMPTY_ADDRESS;
  const addSelectionColumn = hasSelectedGuardian || (onGuardianSelect && guardianSelectionMode === 'Select');
  if (!addSelectionColumn) return {};
  return {
    title: guardiansTableTranslations('columnHeader_selection'),
    field: '',
    render: (rowData) => {
      const { guardian } = rowData;
      return getGuardianSelectionCellContent({
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
      });
    },
    cellStyle: {
      textAlign: 'center' as const,
    },
  };
};

export default getSelectionColumn;
