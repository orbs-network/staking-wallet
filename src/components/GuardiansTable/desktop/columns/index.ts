import { IGroupedGuardian } from './../../interfaces';
import { Column } from 'material-table';
import { Guardian } from '../../../../services/v2/orbsNodeService/systemState';
import getQualificationColumn from './qualifications';
import getNameColumn from './name';
import getAddressColumn from './address';
import getWebsiteColumn from './website';
import getRewardPercentageColumn from './reward-percentage';
import getEffectiveStakeColumn from './effective-stake';
import getParticipationColumn from './participation';
import getCapacityColumn from './capacity';
import getSelectionColumn from './selection';
import { IBaseTableProps } from '../../interfaces';

interface IProps extends IBaseTableProps {
  guardiansTableTranslations: any;
  theme: any;
  copyAddress: (value: string) => void;
}

const createDesktopTableColumns = (props: IProps) => {
  const { committeeMembers, guardiansToDelegatorsCut, guardiansTableTranslations, theme, copyAddress } = props;
  const columns: Column<IGroupedGuardian>[] = [
    getSelectionColumn({ ...props, guardiansTableTranslations, theme }),
    getQualificationColumn(committeeMembers),
    getNameColumn(guardiansTableTranslations),
    getWebsiteColumn(guardiansTableTranslations),
    getAddressColumn(guardiansTableTranslations, copyAddress),
    getRewardPercentageColumn(guardiansToDelegatorsCut, guardiansTableTranslations),
    getEffectiveStakeColumn(guardiansTableTranslations),
    getParticipationColumn(guardiansTableTranslations),
    getCapacityColumn(guardiansTableTranslations),
  ];

  return columns;
};

export default createDesktopTableColumns;
