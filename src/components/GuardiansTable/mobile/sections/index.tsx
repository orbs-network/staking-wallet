import React, { FC } from 'react';
import { useGuardiansTableTranslations } from '../../../../translations/translationsHooks';
import Address from './address';
import useTheme from '@material-ui/core/styles/useTheme';
import Name from './name';
import Capacity from './capacity';
import EffectiveStake from './effective-stake';
import Participation from './participation';
import Qualification from './qualifications';
import Rewards from './reward-percentage';
import Selection from './selection';
import Website from './website';
import { makeStyles } from '@material-ui/core/styles';
import { IBaseTableProps } from '../../interfaces';
import { Guardian } from '../../../../services/v2/orbsNodeService/systemState';

const useStyles = makeStyles({
  container: {
    border: '1px solid white',
    padding: '10px',
    marginBottom: '20px',
  },
});

interface IProps extends IBaseTableProps {
  pageSize: number;
  sortedGuardians: Guardian[];
  guardian: Guardian;
}

const GuardiansMobileSection: FC<IProps> = (props) => {
  const { guardian, committeeMembers, guardiansToDelegatorsCut } = props;
  const guardiansTableTranslations = useGuardiansTableTranslations();
  const theme = useTheme();
  const classes = useStyles();

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
  };

  return (
    <div className={classes.container}>
      <Address {...sectionsProps} />
      <Name {...sectionsProps} />
      <Capacity {...sectionsProps} />
      <EffectiveStake {...sectionsProps} />
      <Participation {...sectionsProps} />
      <Qualification guardian={guardian} committeeMembers={committeeMembers} />
      <Rewards {...sectionsProps} guardiansToDelegatorsCut={guardiansToDelegatorsCut} />
      <Selection {...selectionProps} />
      <Website {...sectionsProps} />
    </div>
  );
};

export default GuardiansMobileSection;
