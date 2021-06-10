import React, { useMemo } from 'react';
import { Guardian } from '../../../services/v2/orbsNodeService/systemState';
import { SvgIcon, Tooltip, Typography } from '@material-ui/core';
import { ICommitteeMemberData } from '../../../services/v2/orbsNodeService/OrbsNodeTypes';
import { ReactComponent as NotCommitteeGuardianShield } from '../assets/guardian_no_committee.svg';
import { ReactComponent as CertifiedNotCommitteeGuardianShield } from '../assets/guardian_no_committee_certified.svg';
import { ReactComponent as CommitteeGuardianShield } from '../assets/guardian_committe.svg';
import { ReactComponent as CertifiedCommitteeGuardianShield } from '../assets/guardian_committee_certiied.svg';
import Moment from 'moment';
import makeStyles from '@material-ui/core/styles/makeStyles';
import useTheme from '@material-ui/core/styles/useTheme';
import { useGuardiansTableTranslations } from '../../../translations/translationsHooks';

interface IProps {
  guardian: Guardian;
  committeeMembershipData?: ICommitteeMemberData;
}

const useStyles = makeStyles((theme) => ({
  tooltip: {
    // width: 'max-content',
    width: 400,
    maxWidth: 'min(600px, 90%)',
  },
}));

export const GuardianQualifications = React.memo<IProps>((props) => {
  const { guardian, committeeMembershipData } = props;
  const classes = useStyles();

  let shieldIcon = NotCommitteeGuardianShield;

  // Is in committee ?
  if (committeeMembershipData) {
    shieldIcon = guardian.IsCertified ? CertifiedCommitteeGuardianShield : CommitteeGuardianShield;
  } else {
    // Certified ?
    shieldIcon = guardian.IsCertified ? CertifiedNotCommitteeGuardianShield : NotCommitteeGuardianShield;
  }

  return (
    <Tooltip
      classes={{ tooltip: classes.tooltip }}
      enterTouchDelay={0}
      title={<GuardianQualificationsTooltip committeeMembershipData={committeeMembershipData} guardian={guardian} />}
      arrow
      placement={'right'}
    >
      <div style={{ height: '4rem', width: '4rem', position: 'relative', cursor: 'pointer', color: 'rgba(0,0,0,0)' }}>
        <SvgIcon component={shieldIcon} viewBox='0 0 40.371 47.178' style={{ height: '100%', width: '100%' }} />
      </div>
    </Tooltip>
  );
});

const useStylesTooltip = makeStyles((theme) => ({
  textField: {
    fontWeight: 'bold',
    display: 'inline',
    color: theme.palette.secondary.main,
  },
  textValue: {
    fontWeight: 'bold',
    display: 'inline',
  },
}));

const GuardianQualificationsTooltip = React.memo<{
  guardian: Guardian;
  committeeMembershipData?: ICommitteeMemberData;
}>((props) => {
  const { guardian, committeeMembershipData } = props;
  const guardiansTableTranslations = useGuardiansTableTranslations();
  const classes = useStylesTooltip();
  const theme = useTheme();

  const isInCommittee = committeeMembershipData !== null && committeeMembershipData !== undefined;
  const committeeEnterTime = committeeMembershipData?.EnterTime;

  const committeePart = useMemo(() => {
    let committeeMessage;

    if (isInCommittee) {
      committeeMessage = (
        <Typography className={classes.textValue} style={{ color: theme.palette.success.main }}>
          - {guardiansTableTranslations('message_inCommittee')}{' '}
          <Typography className={classes.textValue} style={{ color: theme.palette.text.primary }}>
            {guardiansTableTranslations('message_sinceDate', {
              dateText: Moment.unix(committeeEnterTime).utc().format('DD/MM/YYYY hh:mm'),
            })}
          </Typography>
        </Typography>
      );
    } else {
      committeeMessage = (
        <Typography className={classes.textValue} style={{ color: theme.palette.warning.main }}>
          {guardiansTableTranslations('message_notInCommittee')}
        </Typography>
      );
    }

    return <>{committeeMessage}</>;
  }, [
    classes.textValue,
    committeeEnterTime,
    guardiansTableTranslations,
    isInCommittee,
    theme.palette.success.main,
    theme.palette.text.primary,
    theme.palette.warning.main,
  ]);

  const committeeNote = useMemo(() => {
    if (!isInCommittee) {
      return (
        <>
          <Typography style={{ color: theme.palette.text.primary, fontWeight: 'bold', display: 'inline' }}>
            {guardiansTableTranslations('message_pleaseNote')}:{' '}
          </Typography>
          <Typography className={classes.textValue}>
            {guardiansTableTranslations('message_onlyCommitteeMembersAreEntitledToRewards')}
          </Typography>
          <br />
        </>
      );
    } else {
      return null;
    }
  }, [classes.textValue, guardiansTableTranslations, isInCommittee, theme.palette.text.primary]);

  const registeredSincePart = useMemo(() => {
    if (guardian.RegistrationTime) {
      return (
        <>
          <Typography className={classes.textValue} color={'secondary'}>
            {guardiansTableTranslations('message_registeredSinceDate', {
              dateText: Moment.unix(guardian.RegistrationTime).utc().format('DD/MM/YYYY'),
            })}
          </Typography>
          <br />
        </>
      );
    } else {
      return null;
    }
  }, [classes.textValue, guardian.RegistrationTime, guardiansTableTranslations]);

  const certifiedMessage = guardian.IsCertified
    ? guardiansTableTranslations('message_certified')
    : guardiansTableTranslations('message_notCertified');

  return (
    <>
      {/* Committee */}
      {committeePart}
      <br />

      {/* Committee note */}
      {committeeNote}

      {/* Certified */}
      <Typography
        className={classes.textValue}
        style={{ color: guardian.IsCertified ? theme.palette.success.main : theme.palette.warning.main }}
      >
        - {certifiedMessage}
      </Typography>
      <br />

      {/* Registered since */}
      {registeredSincePart}
    </>
  );
});
