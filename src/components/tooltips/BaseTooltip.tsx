import React, { ReactElement } from 'react';
import { HtmlTooltip } from '../base/HtmlTooltip';

interface IProps {
  children: ReactElement;
  arrow?: boolean;
  title: string;
}
function BaseTooltip({ children, arrow, title }: IProps) {
  return (
    <HtmlTooltip enterTouchDelay={0} leaveTouchDelay={4000} title={title} arrow={arrow} interactive>
      {children}
    </HtmlTooltip>
  );
}

export default BaseTooltip;
