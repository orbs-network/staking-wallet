import React, { memo, useCallback, useContext, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import Paper from '@material-ui/core/Paper';
import { IBaseTableProps } from '../../interfaces';
import { Guardian } from '../../../../services/v2/orbsNodeService/systemState';
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
  },
}));

interface IProps extends IBaseTableProps {
  pageSize: number;
  sortedGuardians: Guardian[];
}

const SpanningTable = (props: IProps) => {
  const {
    allChainsGuardians,
    guardiansToDelegatorsCut,
    committeeMembers,
    selectedGuardian,
    onGuardianSelect,
    guardianSelectionMode,
    mainAddress,
    disableSelection,
    isGuardian,
  } = props;

  const classes = useStyles();
  const guardiansTableTranslations = useGuardiansTableTranslations();
  const [showSnackbar, setShowSnackbar] = useState(false);
  const alertsTranslations = useAlertsTranslations();
  const [order, setOrder] = React.useState<any>('asc');
  const [sortBy, setSortBy] = React.useState<string>('');
  const { chainId } = useContext(MobXProviderContext);
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

      const sortedItems = sortData(newSortBy, sortOrder, Object.values(allChainsGuardians), guardiansToDelegatorsCut);
      setSortBy(newSortBy);
      setOrder(sortOrder);
      setSortedData(sortedItems);
    },
    [allChainsGuardians, guardiansToDelegatorsCut, order, sortBy],
  );

  const data = (sortedData.length && sortedData) || (allChainsGuardians && Object.values(allChainsGuardians)) || [];

  return (
    <Paper className={classes.root}>
      <Table className={classes.table}>
        <HeadCells order={order} sortBy={sortBy} requestSort={requestSort} translations={guardiansTableTranslations} />
        <TableBody>
          {data.map((group: IGuardiansDictionary) => {
            return (
              <TableRows
                key={uuidv4()}
                group={group}
                selectedChain={chainId}
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

export default SpanningTable;
