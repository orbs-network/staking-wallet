import React from 'react';

import { IGetGuardianSelectionCellContent } from '../interfaces';
import { selectActionButtonTestIdFromAddress } from '../../../__tests__/components/guardians/guardiansTestUtils';
import { CommonActionButton } from '../../base/CommonActionButton';
import IconButton from '@material-ui/core/IconButton';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import { Tooltip, Typography } from '@material-ui/core';

const GuardianSelectionCellContent = (props: IGetGuardianSelectionCellContent) => {
  const {
    g,
    onGuardianSelect,
    selectedGuardian,
    guardiansTableTranslations,
    guardianSelectionMode,
    theme,
    disableSelection,
    isGuardian,
  } = props;
  let selectedGuardianCell = null;

  const actionButtonTestId = selectActionButtonTestIdFromAddress(g.EthAddress);
  const actionButtonOnClick = () => onGuardianSelect(g);
  const isSelectedGuardian = g.EthAddress.toLowerCase() === selectedGuardian?.toLowerCase();
  switch (guardianSelectionMode) {
    case 'Select':
      selectedGuardianCell = (
        <CommonActionButton disabled={disableSelection} variant={'outlined'} onClick={actionButtonOnClick} fullWidth>
          {guardiansTableTranslations(isSelectedGuardian ? 'action_keep' : 'action_select')}
        </CommonActionButton>
      );
      break;
    case 'Change':
      const enabled = !!onGuardianSelect;
      const actionButtonIcon = isSelectedGuardian ? (
        <CheckCircleOutlineIcon data-testid={'selected-guardian-icon'} />
      ) : (
        <RadioButtonUncheckedIcon data-testid={'unselected-guardian-icon'} />
      );

      if (isGuardian && disableSelection) {
        selectedGuardianCell = (
          <Typography data-testid={`guardian-${g.EthAddress}-selected-status`}>
            <Tooltip
              arrow
              title={
                <Typography style={{ textAlign: 'center' }}>
                  You are a registered Guardian <br /> You must unregister before delegating to another Guardian
                </Typography>
              }
            >
              {actionButtonIcon}
            </Tooltip>
          </Typography>
        );
      } else {
        selectedGuardianCell = (
          <Typography data-testid={`guardian-${g.EthAddress}-selected-status`}>
            <IconButton
              data-testid={actionButtonTestId}
              onClick={actionButtonOnClick}
              disabled={!enabled || disableSelection}
              style={{ color: theme.chain.current.mainColor  }}
            >
              {actionButtonIcon}
            </IconButton>
          </Typography>
        );
      }

      break;
    case 'None':
      selectedGuardianCell = null;
      break;
    default:
      throw new Error(`Invalid guardian selection mode of ${guardianSelectionMode}`);
  }

  return selectedGuardianCell;
};

export default GuardianSelectionCellContent;
