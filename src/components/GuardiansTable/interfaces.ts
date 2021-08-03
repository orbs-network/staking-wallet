import { ICommitteeMemberData } from '../../services/v2/orbsNodeService/OrbsNodeTypes';
import { Guardian } from '../../services/v2/orbsNodeService/systemState';
export type TGuardianSelectionMode = 'Select' | 'Change' | 'None';

export interface IBaseTableProps {
  guardianSelectionMode: TGuardianSelectionMode;
  committeeMembers: ICommitteeMemberData[];
  guardiansToDelegatorsCut: { [guardianAddress: string]: number };
  selectedGuardian?: string;
  onGuardianSelect?: (guardian: Guardian) => void;
  tableTestId?: string;
  extraStyle?: React.CSSProperties;
  tableTitle?: string;
  disableSelection?: boolean;
  // Styling
  densePadding?: boolean;
}

export interface IGetGuardianSelectionCellContent extends ISelectionProps {
  g: Guardian;
  guardiansTableTranslations: any;
  theme: any;
}

export interface ISelectionProps {
  guardiansTableTranslations: any;
  onGuardianSelect?: (guardian: Guardian) => void;
  selectedGuardian?: string;
  guardianSelectionMode: TGuardianSelectionMode;
  theme: any;
  disableSelection?: boolean;
}

export interface IMobileSection {
  guardian: Guardian;
  guardiansTableTranslations: any;
}