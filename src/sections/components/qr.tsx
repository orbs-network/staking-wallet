import React, { FC } from 'react';
import { CommonDialog } from '../../components/modal/CommonDialog';
import { UseBoolean } from 'react-hanger';
import styled from 'styled-components';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { QRCode } from 'react-qrcode-logo';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Grid from '@material-ui/core/Grid';
import { useTheme } from '@material-ui/core/styles';
import { GridProps } from '@material-ui/core';

const QR_IMAGE_DIMENSION_MD = 400;
const LOGO_DIMENSIONS_MD = 100;
const QR_IMAGE_DIMENSION_XS = 240;
const LOGO_DIMENSIONS_XS = 60;
const logo = 'https://icodrops.com/wp-content/uploads/2018/01/Orbs-logo.jpg';
const fgColor = '#07142E';

const CenteredContainerGridForQr = styled((props) => (
  <Grid container direction={'column'} alignItems={'center'} {...props} />
))<GridProps>(({ theme }) => {
  theme = theme as Theme;

  return {
    position: 'fixed',
    top: '35%',
    left: '50%',
    transform: 'translate(-50%, -35%)',
    width: 'min-content',
  };
});

interface IProps {
  showQrModal: UseBoolean;
  mainAddress?: string;
}

const QR: FC<IProps> = ({ showQrModal, mainAddress }) => {
  const theme = useTheme();
  const mediumOrLarger = useMediaQuery(theme.breakpoints.up('md'));
  const qrDimensions = mediumOrLarger ? QR_IMAGE_DIMENSION_MD : QR_IMAGE_DIMENSION_XS;
  const logoDimensions = mediumOrLarger ? LOGO_DIMENSIONS_MD : LOGO_DIMENSIONS_XS;
  return (
    <CommonDialog disableBackdropClick={false} disableAutoFocus open={showQrModal.value} onClose={showQrModal.setFalse}>
      <CenteredContainerGridForQr>
        <Grid item id='qr-code-wrap'>
          <QRCode
            value={mainAddress}
            logoImage={logo}
            logoWidth={logoDimensions}
            logoHeight={logoDimensions}
            size={qrDimensions}
            qrStyle={'dots'}
            fgColor={fgColor}
          />
        </Grid>
      </CenteredContainerGridForQr>
    </CommonDialog>
  );
};

export default QR;
