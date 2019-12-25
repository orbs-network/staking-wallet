import React from 'react';
import styled from 'styled-components';
import { Grid } from '@material-ui/core';

export const WizardContainer = styled(props => <Grid container direction={'column'} alignItems={'center'} {...props} />)({});