import useTheme from '@material-ui/core/styles/useTheme';
import makeStyles from '@material-ui/core/styles/makeStyles';
import React, { FC, useCallback, useMemo, useState } from 'react';
import MaterialTable, { MTableToolbar, MTableBodyRow } from 'material-table';
import { useAlertsTranslations, useGuardiansTableTranslations } from '../../../translations/translationsHooks';
import { TABLE_ICONS } from '../../tables/TableIcons';
import { Guardian } from '../../../services/v2/orbsNodeService/systemState';
import createDesktopTableColumns from './columns/index';

import { IBaseTableProps } from '../interfaces';
import copy from 'copy-to-clipboard';
import CustomSnackbar from '../../snackbar/custom-snackbar';

interface IProps extends IBaseTableProps {
  pageSize: number;
  sortedGuardians: Guardian[];
}

const useStyles = makeStyles((theme) => ({
  toolbarWrapper: {
    '& .MuiToolbar-gutters': {
      backgroundColor: theme.palette.primary.dark,
    },
  },
  breakAll: {
    width: '100%',
    '& *': {
      wordBreak: 'keep-all',
    },
  },
  selectButton: {
    minWidth: '130px',
  },
}));

const NewTable = (props: IProps) => {
  const {
    sortedGuardians,
    pageSize,
    tableTitle,
    selectedGuardian,
    committeeMembers,
    guardiansToDelegatorsCut,
    onGuardianSelect,
    guardianSelectionMode,
    disableSelection,
    isGuardian,
    mainAddress,
    groupedGuardians,
  } = props;

  const classes = useStyles();
  const guardiansTableTranslations = useGuardiansTableTranslations();
  const alertsTranslations = useAlertsTranslations();
  const theme = useTheme();
  const [showSnackbar, setShowSnackbar] = useState<boolean>(false);

  const copyAddress = useCallback((value: string) => {
    copy(value);
    setShowSnackbar(true);
  }, []);

  const tableProps = {
    committeeMembers,
    guardiansToDelegatorsCut,
    onGuardianSelect,
    selectedGuardian,
    guardianSelectionMode,
    disableSelection,
    guardiansTableTranslations,
    theme,
    copyAddress,
    mainAddress,
    isGuardian,
    groupedGuardians,
  };

  const columns = useMemo(() => createDesktopTableColumns(tableProps), [tableProps]);
  
  return (
    <div className={classes.breakAll} style={{ width: '100%' }}>
      <MaterialTable
        title={tableTitle || ''}
        columns={columns}
        data={groupedGuardians}
        icons={TABLE_ICONS}
        style={{ maxWidth: '100%' }}
        options={{
          padding: props.densePadding ? 'dense' : 'default',
          pageSize: pageSize,
          pageSizeOptions: [5, 10, pageSize],
          rowStyle: (guardian: Guardian) => ({
            backgroundColor:
              guardian.EthAddress.toLowerCase() === selectedGuardian?.toLowerCase()
                ? 'rgba(66,66, 66, 0.55)'
                : 'rgba(33,33, 33, 0.55)',
            width: '100%',
          }),
          headerStyle: {
            backgroundColor: theme.palette.primary.dark,
            textAlign: 'center',
          },
        }}
        components={{
          // DEV_NOTE : This 'Hack' to style the toolbar is taken from 'https://github.com/mbrn/material-table/issues/1690#issuecomment-603755197'
          Row: (props) => {
            return (
              <>
                {props.data.guardians.map((guardian: Guardian, index: number) => {
                  return (
                    <MTableBodyRow
                      className={guardian.selectedChain ? 'selected-chain-row' : 'disabled-row'}
                      {...props}
                      data={{ ...props.data, guardian }}
                      key={`${index}-${guardian.EthAddress}`}
                    />
                  );
                })}
              </>
            );
          },
          Toolbar: (props) => (
            <div className={classes.toolbarWrapper}>
              <MTableToolbar {...props} />
            </div>
          ),
        }}
      />

      <CustomSnackbar
        message={alertsTranslations('walletAddressWasCopied')}
        show={showSnackbar}
        hide={() => setShowSnackbar(false)}
        testId='message-address-was-copied'
        variant='success'
      />
    </div>
  );
};

export default NewTable;
