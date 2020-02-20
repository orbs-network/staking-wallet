import React from 'react';
import moment from 'moment';
import { useNumber } from 'react-hanger';
import useInterval from 'use-interval';

interface IProps {
  toTimestamp: number;
}

export const TimeLeftCounter = React.memo<IProps>(props => {
  // DEV_NOTE : These two linea are responsible for re-rendering the component
  const num = useNumber(0);
  useInterval(() => num.setValue(Date.now), 1000);

  const toMoment = moment.unix(props.toTimestamp).utc();

  return <>{toMoment.fromNow(true)}</>;
});
