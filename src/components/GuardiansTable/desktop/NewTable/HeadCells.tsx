import React from 'react';
import { TableCell, TableHead, TableRow, TableSortLabel } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import ColumnHeaderWithTooltip from '../../components/common-tooltip';
import { sortOptions } from './consts';

interface IProps {
  translations: any;
  requestSort: (val: string) => void;
  order: string;
  sortBy: string;
  minSelfStakePercentMille: number;
}

export const useStyles = makeStyles({
  text: {
    fontSize: 13,
  },
});

function HeadCells({ translations, requestSort, order, sortBy, minSelfStakePercentMille }: IProps) {
  const classes = useStyles();

  return (
    <TableHead>
      <TableRow>
        <TableCell></TableCell>
        <TableCell></TableCell>
        <TableCell className={classes.text}>{translations('columnHeader_name')}</TableCell>
        <TableCell className={classes.text}>{translations('columnHeader_website')}</TableCell>
        <TableCell className={classes.text}>{translations('columnHeader_address')}</TableCell>
        <TableCell></TableCell>
        <TableCell className={classes.text}>
          <TableSortLabel onClick={() => requestSort(sortOptions.rewards)}>
            <ColumnHeaderWithTooltip
              headerText={translations('columnHeader_rewardsPercentageToDelegators')}
              tooltipText={translations('columnHeaderInfo_rewardsPercentageToDelegators', {
                minPercentage: 0,
                maxPercentage: 66.667,
              })}
            />
          </TableSortLabel>
        </TableCell>
        <TableCell className={classes.text}>
          <TableSortLabel
            active={sortBy === sortOptions.effectiveStake}
            direction={order as 'desc' | 'asc'}
            onClick={() => requestSort(sortOptions.effectiveStake)}
          >
            <ColumnHeaderWithTooltip
              headerText={translations('columnHeader_effectiveStake')}
              tooltipText={[
                [
                  translations('columnHeaderInfo_effectiveStake_effectiveStakeTitle'),
                  translations('columnHeaderInfo_effectiveStake_effectiveStakeExplain'),
                ],
                [
                  translations('columnHeaderInfo_effectiveStake_ifCapacityOverTitle'),
                  translations('columnHeaderInfo_effectiveStake_ifCapacityOverCalculation'),
                  translations('columnHeaderInfo_effectiveStake_ifCapacityUnderTitle'),
                  translations('columnHeaderInfo_effectiveStake_ifCapacityUnderCalculation'),
                ],
                [
                  translations('columnHeaderInfo_effectiveStake_selfStakeTitle'),
                  translations('columnHeaderInfo_effectiveStake_selfStakeExplanation'),
                ],
                [
                  translations('columnHeaderInfo_effectiveStake_delegatedStakeTitle'),
                  translations('columnHeaderInfo_effectiveStake_delegatedStakeExplanation'),
                ],
              ]}
            />
          </TableSortLabel>
        </TableCell>
        <TableCell className={classes.text}>
          <TableSortLabel
            active={sortBy === sortOptions.participation}
            direction={order as 'desc' | 'asc'}
            onClick={() => requestSort(sortOptions.participation)}
          >
            <ColumnHeaderWithTooltip
              headerText={translations('columnHeader_participation')}
              tooltipText={translations('columnHeaderInfo_participation')}
            />
          </TableSortLabel>
        </TableCell>
        <TableCell className={classes.text}>
          <TableSortLabel
            active={sortBy === sortOptions.capacity}
            direction={order as 'desc' | 'asc'}
            onClick={() => requestSort(sortOptions.capacity)}
          >
            <ColumnHeaderWithTooltip
              headerText={translations('columnHeader_capacity')}
              tooltipText={[translations('columnHeaderInfo_capacity_explanation')]}
            />
          </TableSortLabel>
        </TableCell>
      </TableRow>
    </TableHead>
  );
}

export default HeadCells;
