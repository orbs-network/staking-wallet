/**
 * Copyright 2019 the orbs-ethereum-contracts authors
 * This file is part of the orbs-ethereum-contracts library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */
import React from 'react';
import { ChangeLangLink } from '../../multi-lang/ChangeLangLink';
import Grid from '@material-ui/core/Grid';
import styled from 'styled-components';
import FlagIcon from '../icons/FlagIcon';

const ButtonChangeLangLink = styled(ChangeLangLink)(({ theme }) => ({
  '&:hover': {
    opacity: 0.8,
  },
  // DEV_NOTE : Matching the flag size to the header 'ORBS' title
  fontSize: theme.typography.body1.fontSize,
}));

export const LanguagesSelector = React.memo(props => {
  return (
    <Grid container alignItems={'center'} spacing={2}>
      <Grid item>
        <ButtonChangeLangLink lang='en'>
          <FlagIcon code={'us'} />
        </ButtonChangeLangLink>
      </Grid>
      <Grid item>
        <ButtonChangeLangLink lang='jp'>
          <FlagIcon code={'jp'} />
        </ButtonChangeLangLink>
      </Grid>
      <Grid item>
        <ButtonChangeLangLink lang='ko'>
          <FlagIcon code={'kr'} />
        </ButtonChangeLangLink>
      </Grid>
    </Grid>
  );
});
