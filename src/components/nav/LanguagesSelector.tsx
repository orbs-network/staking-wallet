/**
 * Copyright 2019 the orbs-ethereum-contracts authors
 * This file is part of the orbs-ethereum-contracts library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */
import React from 'react';
import { ChangeLangLink } from '../../multi-lang/ChangeLangLink';
import EN_FLAG from './en-us.png';
import JP_FLAG from './jp.png';
import KO_FLAG from './ko.png';
import Grid from '@material-ui/core/Grid';
import styled from 'styled-components';


const ButtonChangeLangLink = styled(ChangeLangLink)(() => ({
  '&:hover': {
    opacity: 0.8,
  },
}));

export const LanguagesSelector = React.memo(props => {
  return (
    <Grid container alignItems={'center'} spacing={2} >
      <Grid item>
        <ButtonChangeLangLink lang='en'>
          <img src={EN_FLAG} alt='English' />
        </ButtonChangeLangLink>
      </Grid>
      <Grid item>
        <ButtonChangeLangLink lang='jp'>
          <img src={JP_FLAG} alt='Japanese' />
        </ButtonChangeLangLink>
      </Grid>
      <Grid item>
        <ButtonChangeLangLink lang='ko'>
          <img src={KO_FLAG} alt='Korean' />
        </ButtonChangeLangLink>
      </Grid>
    </Grid>
  );
});
