import React, { FC, useState } from 'react';
import { useGuardiansTableTranslations } from '../../../../translations/translationsHooks';
import Address from './address';
import useTheme from '@material-ui/core/styles/useTheme';
import Name from './name';
import Capacity from './capacity';
import EffectiveStake from './effective-stake';
import Participation from './participation';
import Rewards from './rewards';
import Selection from './selection';
import Website from './website';
import { IBaseTableProps } from '../../interfaces';
import { Guardian } from '../../../../services/v2/orbsNodeService/systemState';
import GuardianMobileHeader from './header';
import { useCommonStyles } from './styles';

interface IProps extends IBaseTableProps {
  pageSize: number;
  sortedGuardians: Guardian[];
  guardian: Guardian;
}

const GuardiansMobileSection: FC<IProps> = (props) => {
  const { guardian, committeeMembers, guardiansToDelegatorsCut } = props;
  const guardiansTableTranslations = useGuardiansTableTranslations();
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const theme = useTheme();

  const sectionsProps = {
    guardian,
    guardiansTableTranslations,
  };

  const selectionProps = {
    guardiansTableTranslations,
    onGuardianSelect: props.onGuardianSelect,
    selectedGuardian: props.selectedGuardian,
    guardianSelectionMode: props.guardianSelectionMode,
    theme,
    disableSelection: props.disableSelection,
    guardian,
    isGuardian: props.isGuardian,
    mainAddress: props.mainAddress,
  };
  const commonClasses = useCommonStyles();
  return (
    <div className={commonClasses.container}>
      <GuardianMobileHeader
        {...sectionsProps}
        committeeMembers={committeeMembers}
        onClick={() => setShowDetails(!showDetails)}
      />
      {showDetails && (
        <div style={{ paddingTop: '20px', paddingBottom: '20px', borderBottom: '1px solid rgba(255,255,255, 0.6)' }}>
          <Name {...sectionsProps} committeeMembers={committeeMembers} onClick={() => setShowDetails(false)} />
          <Website {...sectionsProps} />
          <Address {...sectionsProps} />
          <Rewards {...sectionsProps} guardiansToDelegatorsCut={guardiansToDelegatorsCut} />
          <EffectiveStake {...sectionsProps} />
          <Participation {...sectionsProps} />
          <Capacity {...sectionsProps} />
          <Selection {...selectionProps} />
        </div>
      )}
    </div>
  );
};

export default GuardiansMobileSection;
