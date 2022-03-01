import React, { useMemo } from 'react';
import { Guardian } from '../../../services/v2/orbsNodeService/systemState';
import { SvgIcon, Tooltip, Typography } from '@material-ui/core';
import { ICommitteeMemberData } from '../../../services/v2/orbsNodeService/OrbsNodeTypes';
import Moment from 'moment';
import makeStyles from '@material-ui/core/styles/makeStyles';
import useTheme from '@material-ui/core/styles/useTheme';
import { useGuardiansTableTranslations } from '../../../translations/translationsHooks';
import GuardianShieldIcon from './guardian-shield-icon';
import { IExtenedTheme } from '../../../theme/Theme';
import { HtmlTooltip } from '../../base/HtmlTooltip';
import varifiedIcon from '../assets/verified.svg';
import notCertifiedIcon from '../assets/not-certified.svg';

import Box from '@material-ui/core/Box';
import clsx from 'clsx';

interface IProps {
  guardian: Guardian;
  committeeMembershipData?: ICommitteeMemberData;
}

const useStyes = makeStyles((theme: IExtenedTheme) => ({
  tooltip: {
    // width: 'max-content',
    width: 300,
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
      placement='bottom'
    >
      <div className={classes.imgContainer}>
        <GuardianShieldIcon IsCertified={guardian.IsCertified} committeeMembershipData={committeeMembershipData} />
      </div>
    </HtmlTooltip>
  );
});

const useStylesTooltip = makeStyles((theme: IExtenedTheme) => ({
  textField: {
    fontWeight: 'bold',
    display: 'inline',
    color: theme.palette.secondary.main,
  },
  textValue: {
    fontWeight: 'bold',
    display: 'inline',
    textAlign: 'center',
  },
  messageBox: {
    flexDirection: 'column',
    display: 'flex',
    alignItems: 'center',
  },
  certified: {
    position: 'relative',
    marginTop: 10,
    fontWeight: 400,
    '&::before': {
      position: 'absolute',
      left: '50%',
      transform: 'translate(-50%)',
      top: '-13px',
      content: '""',
      height: '1px',
      width: '80px',
      background: 'white',
    },
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
        <Box className={classes.messageBox}>
          <Box style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
            <img src={varifiedIcon} style={{ marginRight: 10, width: 20 }} />
            <Typography style={{ color: '#72F8F4', fontWeight: 600 }}>{guardiansTableTranslations('message_inCommittee')}</Typography>
          </Box>
          <Typography className={classes.textValue}>
            {guardiansTableTranslations('message_sinceDate', {
              dateText: Moment.unix(committeeEnterTime).utc().format('DD/MM/YYYY hh:mm'),
            })}
          </Typography>
        </Box>
      );
    } else {
      committeeMessage = (
        <Typography className={classes.textValue}>{guardiansTableTranslations('message_notInCommittee')}</Typography>
      );
    }

    return <>{committeeMessage}</>;
  }, [classes.messageBox, classes.textValue, committeeEnterTime, guardiansTableTranslations, isInCommittee]);

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
          <Typography className={classes.textValue}>
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

  const certifiedMessage = guardian.IsCertified ? (
    <Box style={{ display: 'flex', alignItems: 'center' }}>
      <Typography>{guardiansTableTranslations('message_certified')}</Typography>
    </Box>
  ) : (
    <Box style={{ display: 'flex', alignItems: 'center' }}>
      <img src={notCertifiedIcon} style={{ marginRight: 10, width: 14 }} />
      <Typography>{guardiansTableTranslations('message_notCertified')}</Typography>
    </Box>
  );

  return (
    <Box className={classes.messageBox}>
      {/* Committee */}
      {committeePart}
      <br />

      {/* Committee note */}
      {committeeNote}

      {/* Certified */}
      <Typography
        className={clsx(classes.textValue, classes.certified)}
        style={{ color: guardian.IsCertified ? theme.palette.success.main : theme.palette.warning.main }}
      >
        {certifiedMessage}
      </Typography>
      <br />

      {/* Registered since */}
      {registeredSincePart}
    </Box>
  );
});
