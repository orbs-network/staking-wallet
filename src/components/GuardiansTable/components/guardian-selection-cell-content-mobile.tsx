import React from 'react';

import { IGetGuardianSelectionCellContent } from '../interfaces';
import { selectActionButtonTestIdFromAddress } from '../../../__tests__/components/guardians/guardiansTestUtils';
import { CommonActionButton } from '../../base/CommonActionButton';
import { Typography } from '@material-ui/core';

const GuardianSelectionCellContentMobile = (props: IGetGuardianSelectionCellContent) => {
  const {
    g,
    onGuardianSelect,
    selectedGuardian,
    guardiansTableTranslations,
    guardianSelectionMode,
    theme,
    disableSelection,
  } = props;

  const actionButtonTestId = selectActionButtonTestIdFromAddress(g.EthAddress);
  const actionButtonOnClick = () => onGuardianSelect(g);
  const isSelectedGuardian = g.EthAddress.toLowerCase() === selectedGuardian?.toLowerCase();

  switch (guardianSelectionMode) {
    case 'Select':
      return (
        <CommonActionButton disabled={disableSelection} variant={'outlined'} onClick={actionButtonOnClick} fullWidth>
          {guardiansTableTranslations(isSelectedGuardian ? 'action_keep' : 'action_select')}
        </CommonActionButton>
      );
      break;
    case 'Change':
      const enabled = !!onGuardianSelect;
      return isSelectedGuardian ? (
        <Typography>Selected</Typography>
      ) : (
        <Typography data-testid={`guardian-${g.EthAddress}-selected-status`}>
          <CommonActionButton
            data-testid={actionButtonTestId}
            onClick={actionButtonOnClick}
            disabled={!enabled || disableSelection}
            style={{ height: '35px' }}
          >
            Select
          </CommonActionButton>
        </Typography>
      );

    case 'None':
      return null;
    default:
      throw new Error(`Invalid guardian selection mode of ${guardianSelectionMode}`);
  }
};

export default GuardianSelectionCellContentMobile;
