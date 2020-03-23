/**
 * Copyright 2019 the orbs-ethereum-contracts authors
 * This file is part of the orbs-ethereum-contracts library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */
import React, { CSSProperties } from 'react';
import { ChangeLangLink } from '../../multi-lang/ChangeLangLink';
import Grid from '@material-ui/core/Grid';
import styled from 'styled-components';
import Icon from '@material-ui/core/Icon';

const ButtonChangeLangLink = styled(ChangeLangLink)(({ theme }) => ({
  '&:hover': {
    opacity: 0.8,
  },
  // DEV_NOTE : Matching the flag size to the header 'ORBS' title
  fontSize: theme.typography.body1.fontSize,
}));

// TODO : FUTURE : O.L : Fix the country icons styling (notice that is is being wrapped in an 'a' element)
//        + Maybe find a a better way to import the images
const styleForIcon: CSSProperties = {
  textAlign: 'center',
};
const CountrySvgImg = styled('img')(({ theme }) => ({
  height: '0.75em',
}));

export const LanguagesSelector = React.memo(props => {
  return (
    <Grid container alignItems={'center'} spacing={2}>
      <Grid item>
        <ButtonChangeLangLink lang='en'>
          <Icon style={styleForIcon}>
            <CountrySvgImg src='/assets/countryIcons/us.svg' />
          </Icon>
        </ButtonChangeLangLink>
      </Grid>
      <Grid item>
        <ButtonChangeLangLink lang='jp'>
          <Icon style={styleForIcon}>
            <CountrySvgImg src='/assets/countryIcons/jp.svg' />
          </Icon>
        </ButtonChangeLangLink>
      </Grid>
      <Grid item>
        <ButtonChangeLangLink lang='kr'>
          <Icon style={styleForIcon}>
            <CountrySvgImg src='/assets/countryIcons/kr.svg' />
          </Icon>
        </ButtonChangeLangLink>
      </Grid>
    </Grid>
  );
});
