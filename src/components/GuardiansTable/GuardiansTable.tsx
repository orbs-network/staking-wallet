import React from 'react';
import constants from '../../constants/constants';
import { Guardian } from '../../services/v2/orbsNodeService/systemState';
import useResize from '../hooks/useResize';
import GuardiansDesktop from './desktop/index';
import { IBaseTableProps } from './interfaces';
import GuardiansMobile from './mobile/index';
import { createTableProps } from './util';
interface IProps extends IBaseTableProps {
  guardians: Guardian[];
}

export const GuardiansTable = React.memo<IProps>((props) => {
  const tableProps = createTableProps(props);
  const windowWidth = useResize();
  const isMobile = windowWidth <= constants.mobile;

  return isMobile ? <GuardiansMobile {...tableProps} /> : <GuardiansDesktop {...tableProps} />;
});
