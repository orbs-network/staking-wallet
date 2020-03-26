import React from 'react';
import styled from 'styled-components';
import Button, { ButtonProps } from '@material-ui/core/Button';

export const CommonActionButton = styled((props: ButtonProps) => (
  <Button color={'secondary'} variant={'contained'} {...props} />
))<ButtonProps>(({ theme }) => {
  return {
    fontWeight: 'bold',
    height: '4em',
    boxShadow: '0.15em 0.2em #469daf',
  };
});
