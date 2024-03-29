import React from 'react';
import CountUp from 'react-countup';
import { Grid, Typography } from '@material-ui/core';
import constants from '../../../constants/constants';
import config from '../../../../config';

const counterProps = {
  preserveValue: true,
  delay: 0.4,
};

const handleFullNumber = (value: number) => {
  return value.toLocaleString();
};

const handleDecimals = (value: number) => {
  const stringValue = value.toString();
  const calibratedDecimalLimit = constants.numbersDecimalToDisplayLimit + 1;
  const isOutOfLimit = stringValue.length > calibratedDecimalLimit;
  const val = stringValue.substring(1, calibratedDecimalLimit);
  return `${config.numberSeparator.decimal}${val}`;
};
interface IProps {
  amount: string;
  isLoading: boolean;
}

const BalanceCardCounters = ({ amount, isLoading }: IProps) => {
  const [full, decimal] = amount.split('.');


  return (
    <Grid item>
      <Typography variant={'h4'} style={{ marginBottom: '0.7em', marginTop: '0.2em' }} data-testid={'balance_text'}>
        {/* {amount} */}
        {!isLoading ? (
          Number(amount) === 0 ? (
            0
          ) : (
            <>
              <CountUp end={full as any} formattingFn={handleFullNumber} {...counterProps} />
              {decimal && Number(decimal) > 0 && <CountUp end={parseInt('1' + decimal) as any} preserveValue formattingFn={handleDecimals} />}
            </>
          )
        ) : (
          '---'
        )}
      </Typography>
    </Grid>
  );
};

export default BalanceCardCounters;
