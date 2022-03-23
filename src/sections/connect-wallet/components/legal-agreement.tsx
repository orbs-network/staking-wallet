import React from 'react';
import { PRIVACY_POLICY_URL, TERMS_OF_SERVICE_URL } from '../../../constants';
import { useCommonsTranslations, useConnectWalletSectionTranslations } from '../../../translations/translationsHooks';
import useTheme from '@material-ui/core/styles/useTheme';
import { renderToString } from 'react-dom/server';
import { Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import { Checkbox, FormControlLabel, Theme } from '@material-ui/core';

interface IProps {
  shouldDisplayLegalTicker: boolean;
  checked: boolean;
  onChange: (e: any) => void;
}

function LegalAgreement({ shouldDisplayLegalTicker, checked, onChange }: IProps) {
  const connectWalletSectionTranslations = useConnectWalletSectionTranslations();
  const cryptoWalletConnectionStore = useCommonsTranslations();

  const theme = useTheme();
  const agreement = connectWalletSectionTranslations('agreeToTheToUAndPrivacyPolicy', {
    termsOfUseText: renderToString(
      <a
        style={{ color: theme.palette.secondary.main }}
        target={'_blank'}
        rel={'noopener noreferrer'}
        href={TERMS_OF_SERVICE_URL}
      >
        {cryptoWalletConnectionStore('termsOfUse')}
      </a>,
    ),
    privacyPolicyText: renderToString(
      <a
        style={{ color: theme.palette.secondary.main  }}
        target={'_blank'}
        rel={'noopener noreferrer'}
        href={PRIVACY_POLICY_URL}
      >
        {cryptoWalletConnectionStore('privacyPolicy')}
      </a>,
    ),
  });

  return shouldDisplayLegalTicker ? (
    <Grid item>
      <FormControlLabel
        control={<Checkbox checked={checked} onChange={onChange} name='legalTicker' />}
        label={<Typography onClick={(e) => e.preventDefault()} dangerouslySetInnerHTML={{ __html: agreement }} />}
      />
    </Grid>
  ) : null;
}

export default LegalAgreement;
