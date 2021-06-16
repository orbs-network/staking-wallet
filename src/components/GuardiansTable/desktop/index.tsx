import useTheme from '@material-ui/core/styles/useTheme';
import makeStyles from '@material-ui/core/styles/makeStyles';
import React, { FC } from 'react';
import MaterialTable, { MTableToolbar } from 'material-table';
import { useGuardiansTableTranslations } from '../../../translations/translationsHooks';
import { TABLE_ICONS } from '../../tables/TableIcons';
import { Guardian } from '../../../services/v2/orbsNodeService/systemState';
import createDesktopTableColumns from './columns/index';
import { IBaseTableProps } from '../interfaces';
import { createDesktopTableProps } from '../util';
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

const GuardiansDesktop: FC<IProps> = (props) => {
  const { sortedGuardians, pageSize, tableTitle, selectedGuardian } = props;

  const classes = useStyles();
  const guardiansTableTranslations = useGuardiansTableTranslations();
  const theme = useTheme();

  const desktopTableProps = createDesktopTableProps({ ...props, guardiansTableTranslations, theme });
  const columns = createDesktopTableColumns(desktopTableProps);

  return (
    <div className={classes.breakAll}>
      <MaterialTable
        title={tableTitle || ''}
        columns={columns}
        data={sortedGuardians}
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
          Toolbar: (props) => (
            <div className={classes.toolbarWrapper}>
              <MTableToolbar {...props} />
            </div>
          ),
        }}
      />
    </div>
  );
};

export default GuardiansDesktop;
