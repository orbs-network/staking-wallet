import React, { useEffect, useMemo } from 'react';
import moment from 'moment';
import { useNumber } from 'react-hanger';
import useInterval from 'use-interval';

interface IProps {
  toTimestamp: number;
  onToMomentReached?: () => void;
}

export const TimeLeftCounter = React.memo<IProps>(props => {
  const { toTimestamp, onToMomentReached } = props;
  // DEV_NOTE : These two linea are responsible for re-rendering the component
  const num = useNumber(0);
  useInterval(() => num.setValue(Date.now), 1000);

  const toMoment = useMemo(() => moment.unix(toTimestamp).utc(), [props.toTimestamp]);
  const nowMoment = moment.utc();
  const nowMomentTimestamp = moment.utc().unix();

  useEffect(() => {
    if (nowMomentTimestamp >= toTimestamp) {
      if (onToMomentReached) {
        onToMomentReached();
      }
    }
  }, [nowMomentTimestamp, onToMomentReached, toTimestamp]);

  return <>{toMoment.fromNow(true)}</>;
});
