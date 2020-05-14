import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import { DialogProps } from '@material-ui/core/Dialog/Dialog';
import styled from 'styled-components';
import { Backdrop, DialogContent, DialogTitle, useMediaQuery } from '@material-ui/core';
import useTheme from '@material-ui/core/styles/useTheme';
import Color from 'color';

const DarkBackdrop = styled(Backdrop)(() => ({
  backgroundColor: 'rgba(0, 0, 0, 0.9)',
}));

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '.MuiDialog-paper': {
    // Box Effect
    border: '1px solid #979797',
    borderRadius: 5,
    boxShadow: theme.shadows[2],

    // Dimensions
    maxHeight: '100%',

    // Colors
    backgroundColor: Color(theme.palette.primary.dark)
      // .fade(0.1)
      .toString(),

    [theme.breakpoints.down('xs')]: {
      margin: '0.5em',
    },

    // TODO : Might move this to 'Wizard'
    // '.MuiDialogContent-root': {
    //   maxHeight: '100%',
    //   height: 'auto',
    //
    //   [theme.breakpoints.down('xs')]: {
    //     paddingRight: 0,
    //     paddingLeft: 0,
    //   },
    // },
  },
}));

export const CommonDialog = React.memo<DialogProps>((props) => {
  const { children, ...others } = props;

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));

  // TODO : C.F.H : We need to re-haul the whole structure, now with our better understanding of the components
  //  Check about padding when mobile ('xs')
  // + Figure out how to align the content vertically on mobile

  return (
    <StyledDialog
      disableBackdropClick
      // fullScreen={fullScreen}
      // fullWidth={!fullScreen}
      maxWidth={'lg'}
      BackdropComponent={DarkBackdrop}
      scroll={'paper'}
      {...others}
      id={'commonDialog'}
    >
      {/*<DialogTitle> Test title</DialogTitle>*/}
      {/*<DialogContent style={{ border: '1px solid green' }}>{children}</DialogContent>*/}
      {children}
    </StyledDialog>
  );
});
