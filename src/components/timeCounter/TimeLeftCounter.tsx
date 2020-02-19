import React from 'react';
import moment from 'moment';

interface IProps {
  toTimestamp: number;
}

export const TimeLeftCounter = React.memo<IProps>(props => {
  const toMoment = moment.unix(props.toTimestamp).utc();

  return <>{toMoment.fromNow(true)}</>;
});
