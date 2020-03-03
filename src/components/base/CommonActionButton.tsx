import React from 'react';
import styled from 'styled-components';
import Button, { ButtonProps } from '@material-ui/core/Button';

export const CommonActionButton = styled((props: ButtonProps) => (
  <Button color={'secondary'} variant={'contained'} {...props} />
))(({ theme }) => {
  return {
    fontWeight: 'bold',
    height: '4em',
  };
});
