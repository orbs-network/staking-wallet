import { join } from 'lodash';
import { IGuardiansDictionary } from './../../../../services/v2/orbsNodeService/OrbsNodeTypes';
import { minStrokeWidth, sortOptions } from './consts';
import { Theme } from '@material-ui/core/styles';

const sortData = (
  sortBy: string,
  sortOrder: string,
  data: IGuardiansDictionary[],
  guardiansToDelegatorsCut?: { [guardianAddress: string]: number },
) => {
  const itemsToSort = JSON.parse(JSON.stringify(Object.values(data)));
  let sortedItems = [];
  let compareFn = null;
  switch (sortBy) {
    case sortOptions.effectiveStake:
      compareFn = (i: IGuardiansDictionary, j: IGuardiansDictionary) => {
        if (i.EffectiveStake < j.EffectiveStake) {
          return sortOrder === 'asc' ? -1 : 1;
        } else {
          if (i.EffectiveStake > j.EffectiveStake) {
            return sortOrder === 'asc' ? 1 : -1;
          } else {
            return 0;
          }
        }
      };
      break;
    case sortOptions.participation:
      compareFn = (i: IGuardiansDictionary, j: IGuardiansDictionary) => {
        if (i.ParticipationPercentage < j.ParticipationPercentage) {
          return sortOrder === 'asc' ? -1 : 1;
        } else {
          if (i.ParticipationPercentage > j.ParticipationPercentage) {
            return sortOrder === 'asc' ? 1 : -1;
          } else {
            return 0;
          }
        }
      };
      break;
    case sortOptions.capacity:
      compareFn = (i: IGuardiansDictionary, j: IGuardiansDictionary) => {
        if (i.Capacity < j.Capacity) {
          return sortOrder === 'asc' ? -1 : 1;
        } else {
          if (i.Capacity > j.Capacity) {
            return sortOrder === 'asc' ? 1 : -1;
          } else {
            return 0;
          }
        }
      };
      break;
    case sortOptions.rewards:
      if (!guardiansToDelegatorsCut) {
        return;
      }
      compareFn = (i: IGuardiansDictionary, j: IGuardiansDictionary) => {
        const first = guardiansToDelegatorsCut[i.EthAddress];
        const second = guardiansToDelegatorsCut[j.EthAddress];
        if (first < second) {
          return sortOrder === 'asc' ? -1 : 1;
        } else {
          if (first > second) {
            return sortOrder === 'asc' ? 1 : -1;
          } else {
            return 0;
          }
        }
      };
      break;
    default:
      break;
  }
  sortedItems = itemsToSort.sort(compareFn);
  return sortedItems;
};

const getStrokeColor = (percent: number, theme: Theme, chain: number, isSelectedChain: boolean) => {
  if(!isSelectedChain){
    return theme.chain[chain].strokeColors.disabled;
  }
  if (percent <= 10) {
    return theme.chain[chain].strokeColors.low;
  }
  return theme.chain[chain].strokeColors.high;
};

const getStrokePercent = (num: number) => {
  if (num <= minStrokeWidth) {
    return minStrokeWidth;
  }
  if (num > 100) {
    return 100;
  }
  return num;
};

export { sortData, getStrokeColor, getStrokePercent };
