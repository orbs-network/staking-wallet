import React, { useMemo } from 'react';
import { Guardian } from '../../../services/v2/orbsNodeService/systemState';
import { Tooltip, Typography } from '@material-ui/core';
import { ICommitteeMemberData } from '../../../services/v2/orbsNodeService/OrbsNodeTypes';
import Moment from 'moment';
import makeStyles from '@material-ui/core/styles/makeStyles';
import useTheme from '@material-ui/core/styles/useTheme';
import { useGuardiansTableTranslations } from '../../../translations/translationsHooks';
import GuardianShieldIcon from './guardian-shield-icon';
import { IExtenedTheme } from '../../../theme/Theme';
import { HtmlTooltip } from '../../base/HtmlTooltip';
interface IProps {
  guardian: Guardian;
  committeeMembershipData?: ICommitteeMemberData;
}

const useStyes = makeStyles((theme: IExtenedTheme) => ({
  tooltip: {
    // width: 'max-content',
    width: 400,
    maxWidth: 'min(600px, 90%)',
  },
  imgContainer: {
    height: '3.5rem',
    width: '3.5rem',
    position: 'relative',
    cursor: 'pointer',
    color: 'rgba(0,0,0,0)',
  },
}));

export const GuardianQualifications = React.memo<IProps>((props) => {
  const { guardian, committeeMembershipData } = props;

  const classes = useStyes();

  return (
    <HtmlTooltip
      classes={{ tooltip: classes.tooltip }}
      enterTouchDelay={0}
      title={<GuardianQualificationsTooltip committeeMembershipData={committeeMembershipData} guardian={guardian} />}
      arrow
      placement={'right'}
    >
      <div className={classes.imgContainer}>
        <GuardianShieldIcon IsCertified={guardian.IsCertified} committeeMembershipData={committeeMembershipData} />
      </div>
    </HtmlTooltip>
  );
});

const useStylesTooltip = makeStyles((theme: IExtenedTheme) => ({
  shield: {
    filter: theme.custom?.filter,
  },
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
          <Typography className={classes.textValue}>
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
