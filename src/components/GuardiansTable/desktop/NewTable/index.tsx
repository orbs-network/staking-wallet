import React, { memo, useCallback, useContext, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import Paper from '@material-ui/core/Paper';
import { IBaseTableProps } from '../../interfaces';
import { useAlertsTranslations, useGuardiansTableTranslations } from '../../../../translations/translationsHooks';
import copy from 'copy-to-clipboard';
import CustomSnackbar from '../../../snackbar/custom-snackbar';
import TableRows from './TableRows';
import { v4 as uuidv4 } from 'uuid';
import { sortData } from './utils';
import { IGuardiansDictionary } from '../../../../services/v2/orbsNodeService/OrbsNodeTypes';
import { MobXProviderContext } from 'mobx-react';
import HeadCells from './HeadCells';
const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(3),
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,

    '& td': {
      paddingBottom: '20px',
    },
  },
}));

interface IProps extends IBaseTableProps {
  sortedGuardians: IGuardiansDictionary[];
}

const DesktopTable = (props: IProps) => {
  const {
    guardiansToDelegatorsCut,
    committeeMembers,
    selectedGuardian,
    onGuardianSelect,
    guardianSelectionMode,
    mainAddress,
    disableSelection,
    isGuardian,
    sortedGuardians,
    selectedChain,
    minSelfStakePercentMille,
  } = props;

  const classes = useStyles();
  const guardiansTableTranslations = useGuardiansTableTranslations();
  const [showSnackbar, setShowSnackbar] = useState(false);
  const alertsTranslations = useAlertsTranslations();
  const [order, setOrder] = React.useState<any>('asc');
  const [sortBy, setSortBy] = React.useState<string>('');
  const [sortedData, setSortedData] = useState([]);
  const copyAddress = useCallback((value: string) => {
    copy(value);
    setShowSnackbar(true);
  }, []);

  const requestSort = useCallback(
    (pSortBy: string) => {
      let newSortBy = sortBy;
      let sortOrder = order;
      if (pSortBy === sortBy) {
        sortOrder = order === 'asc' ? 'desc' : 'asc';
      } else {
        newSortBy = pSortBy;
        sortOrder = 'asc';
      }

      const sortedItems = sortData(newSortBy, sortOrder, sortedGuardians, guardiansToDelegatorsCut);
      setSortBy(newSortBy);
      setOrder(sortOrder);
      setSortedData(sortedItems);
    },
    [sortedGuardians, guardiansToDelegatorsCut, order, sortBy],
  );

  const data = (sortedData.length && sortedData) || sortedGuardians || [];

  return (
    <Paper className={classes.root}>
      <Table className={classes.table}>
        <HeadCells
          order={order}
          sortBy={sortBy}
          requestSort={requestSort}
          translations={guardiansTableTranslations}
          minSelfStakePercentMille={minSelfStakePercentMille}
        />
        <TableBody>
          {data.map((group: IGuardiansDictionary) => {
            return (
              <TableRows
                key={uuidv4()}
                group={group}
                selectedChain={selectedChain}
                guardiansToDelegatorsCut={guardiansToDelegatorsCut}
                committeeMembers={committeeMembers}
                selectedGuardian={selectedGuardian}
                onGuardianSelect={onGuardianSelect}
                guardianSelectionMode={guardianSelectionMode}
                mainAddress={mainAddress}
                disableSelection={disableSelection}
                isGuardian={isGuardian}
                guardiansTableTranslations={guardiansTableTranslations}
                copyAddress={copyAddress}
              />
            );
          })}
        </TableBody>
      </Table>
      <CustomSnackbar
        message={alertsTranslations('walletAddressWasCopied')}
        show={showSnackbar}
        hide={() => setShowSnackbar(false)}
        testId='message-address-was-copied'
        variant='success'
      />
    </Paper>
  );
};

export default DesktopTable;
