import React from 'react';
import styled from 'styled-components';
import { Grid } from '@material-ui/core';

export const WizardContent = styled((props) => (
  <Grid container direction={'column'} alignItems={'center'} justify={'space-between'} spacing={2} {...props} id={'wizardContent'}/>
))(() => ({
  // Makes the content wrapping box appear in the center (regardless of used width)
  alignSelf: 'center',

  // Cancels the margins of the 'spacing' property + Resets the width
  margin: 0,
  width: 'calc(100%)',
}));
