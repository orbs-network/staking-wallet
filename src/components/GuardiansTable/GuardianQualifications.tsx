import React from 'react';
import { Guardian } from '../../services/v2/orbsNodeService/systemState';
import { Icon, SvgIcon, Tooltip, Typography } from '@material-ui/core';
import { ICommitteeMemberData } from '../../services/v2/orbsNodeService/OrbsNodeTypes';
import { ReactComponent as GuardianShield } from './assets/guardian_normal.svg';
import { ReactComponent as CommitteeGuardianShield } from './assets/guardian_committee.svg';
import Moment from 'moment';

interface IProps {
  guardian: Guardian;
  committeeMembershipData?: ICommitteeMemberData;
}

export const GuardianQualifications = React.memo<IProps>((props) => {
  const { guardian, committeeMembershipData } = props;

  const SelectedIcon = committeeMembershipData ? CommitteeGuardianShield : GuardianShield;

  return (
    <Tooltip
      enterTouchDelay={0}
      title={<GuardianQualificationsTooltip committeeMembershipData={committeeMembershipData} guardian={guardian} />}
      arrow
      placement={'right'}
    >
      <div style={{ height: '3rem', width: '3rem', position: 'relative', cursor: 'pointer' }}>
        <SvgIcon component={SelectedIcon} viewBox='0 0 40.371 47.178' style={{ height: '100%', width: '100%' }} />
        {/*{committeeMembershipData ? 'In committee' : null}*/}
        {/*{guardian.IsCertified ? 'Certified' : null}*/}
        <Typography
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translateX(-55%) translateY(-50%)',
          }}
        >
          {guardian.IsCertified ? 'V' : '?'}
        </Typography>
      </div>
    </Tooltip>
  );
});

const GuardianQualificationsTooltip = React.memo<{
  guardian: Guardian;
  committeeMembershipData?: ICommitteeMemberData;
}>((props) => {
  const { guardian, committeeMembershipData } = props;

  // TODO : ORL : TRANSLATIONS
  const committeeMembershipMessage = committeeMembershipData
    ? `In committee since ${Moment.unix(committeeMembershipData.EnterTime).utc().format('DD/MM/YYYY hh:mm')}`
    : 'Not in committee';

  const certifiedMessage = guardian.IsCertified ? 'Certified' : 'Not certified';

  const registeredSinceMessage = `Registered since ${Moment.unix(guardian.RegistrationTime)
    .utc()
    .format('DD/MM/YYYY')}`;

  return (
    <>
      {/* Committee */}
      <Typography>- {committeeMembershipMessage}</Typography>
      <Typography>Note: only committee members and their delegators are entitled to rewards</Typography>
      <br />
      {/* Certified */}
      <Typography>- {certifiedMessage}</Typography>
      <br />
      {/* Registered since */}
      <Typography>- {registeredSinceMessage}</Typography>
      <br />
    </>
  );
});
