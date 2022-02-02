import React, { FC } from 'react';
import { InfoToolTipIcon } from '../../tooltips/InfoTooltipIcon';

interface IColumnHeaderWithTooltipProps {
  headerText: string;
  tooltipText: string | Array<string | string[]>;
}

const ColumnHeaderWithTooltip: FC<IColumnHeaderWithTooltipProps> = ({ headerText, tooltipText }) => {
  return (
    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
      {headerText} <span style={{ width: '0.5rem' }} /> <InfoToolTipIcon  tooltipTitle={tooltipText} />
    </span>
  );
};

export default ColumnHeaderWithTooltip;
