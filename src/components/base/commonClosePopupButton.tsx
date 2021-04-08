import React from 'react';
import styled from 'styled-components';
import Button, { ButtonProps } from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
const styles = {};

export const CommonClosePopupButton = styled(({ variant, color, ...rest }) => (
  <div
    style={{
      position: 'absolute',
      top: '5px',
      right: '5px',
      width: 'fit-content',
      cursor: 'pointer',
    }}
    {...rest}
  >
    <CloseIcon style={{ width: '30px', height: '30px' }} />
  </div>
))<ButtonProps>(({ theme }) => {
  return {
    fontWeight: 'bold',
    height: '4em',
    // boxShadow: '0.15em 0.2em #469daf',
    transitionDuration: '0.5s',
  };
});
