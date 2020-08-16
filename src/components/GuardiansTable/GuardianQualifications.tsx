import React from 'react';
import { Guardian } from '../../services/v2/orbsNodeService/model';
import { Tooltip, Typography } from '@material-ui/core';
import { ICommitteeMemberData } from '../../services/v2/orbsNodeService/OrbsNodeTypes';
import Moment from 'moment';

interface IProps {
  guardian: Guardian;
  committeeMembershipData?: ICommitteeMemberData;
}

export const GuardianQualifications = React.memo<IProps>((props) => {
  const { guardian, committeeMembershipData } = props;
  return (
    <Tooltip
      title={<GuardianQualificationsTooltip committeeMembershipData={committeeMembershipData} guardian={guardian} />}
      arrow
      placement={'right'}
    >
      <div style={{ height: '3rem', width: '3rem', border: '1px solid white' }}>
        {committeeMembershipData ? 'In committee' : null}
        {guardian.IsCertified ? 'Certified' : null}
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
