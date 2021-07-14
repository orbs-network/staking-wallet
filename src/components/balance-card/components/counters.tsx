import React from 'react';
import CountUp from 'react-countup';
import { Grid, Typography } from '@material-ui/core';
import constants from '../../../constants/constants';
import { numberToString } from '../../../utils/numberUtils';
import { addCommasToString } from '../../../utils/stringUtils';
const counterProps = {
  preserveValue: true,
  delay: 0.4,
};

const handleFullNumber = (value: number) => {
  return addCommasToString(numberToString(value));
};

const handleDecimals = (num: number) => {
  const value = numberToString(num);
  const isOutOfLimit = value.length > constants.numbersDecimalToDisplayLimit;
  const showDots = constants.numbersDecimalToDisplayLimit && isOutOfLimit;
  const val = isOutOfLimit ? value.substring(0, constants.numbersDecimalToDisplayLimit) : value;
  const result = showDots ? `${val}...` : `${val}`;
  return `.${result}`;
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
        {!isLoading ? (
          <>
            <CountUp end={full as any} formattingFn={handleFullNumber} {...counterProps} />
            {decimal && <CountUp end={decimal as any} formattingFn={handleDecimals} {...counterProps} />}
          </>
        ) : (
          '---'
        )}
      </Typography>
    </Grid>
  );
};

export default BalanceCardCounters;
