import { Guardian } from '../../../../services/v2/orbsNodeService/systemState';
import { EMPTY_ADDRESS } from '../../../../constants';
import { ISelectionProps } from '../../interfaces';
import getGuardianSelectionCellContent from '../../components/guardian-selection-cell-content';

const getSelectionColumn = (props: ISelectionProps) => {
  const {
    guardiansTableTranslations,
    onGuardianSelect,
    selectedGuardian,
    guardianSelectionMode,
    theme,
    disableSelection,
  } = props;
  const hasSelectedGuardian = !!selectedGuardian && selectedGuardian !== EMPTY_ADDRESS;
  const addSelectionColumn = hasSelectedGuardian || (onGuardianSelect && guardianSelectionMode === 'Select');
  if (!addSelectionColumn) return {};
  return {
    title: guardiansTableTranslations('columnHeader_selection'),
    field: '',
    render: (g: Guardian) => {
      return getGuardianSelectionCellContent({
        g,
        onGuardianSelect,
        selectedGuardian,
        guardiansTableTranslations,
        guardianSelectionMode,
        theme,
        disableSelection,
      });
    },
    cellStyle: {
      textAlign: 'center' as const,
    },
  };
};

export default getSelectionColumn;
