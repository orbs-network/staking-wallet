import { Grid } from '@material-ui/core';
import styled from 'styled-components';
import { makeStyles } from '@material-ui/core/styles';

export const LoaderFigure = styled(Grid)(({ theme }) => ({
  // backgroundColor: 'rgba(33,33, 33, 0.55)',
  backgroundColor: 'rgba(255, 255, 255, 0.35)',
  height: '18px',
  width: '100%',
  borderRadius: '10px',
}));

export const useLoaderStyles = makeStyles((theme) => ({
  wrapper: {
    position: 'relative',
    width: '100%',
  },
  base: {
    overflow: 'hidden',
    width: '100%',
    position: 'relative',
  },
  overlay: {
    background: 'rgba(255,255,255, 0.5)',
  },
  absolute: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: '0px',
    left: '0px',
  },
  children: {
    opacity: 0,
  },

  balaceCardtopFigure: {
    maxWidth: '60%',
  },
  balanceCardbottomFigure: {
    maxWidth: '200px',
    marginTop: '0px',
  },
  balanceCardSmallFigure: {
    maxWidth: '100px',
    marginTop: '0px',
  },
  balanceCardlastFigure: {
    maxWidth: '100px',
    marginTop: '20px',
  },
  addressLoaderFigure: {
    maxWidth: '80%',
    minHeight: '22px',
  },
  guardiansbigFigure: {
    maxWidth: '60%',
  },
  guardiansMediumFigure: {
    maxWidth: '40%',
    marginTop: '0px',
  },
  guardianSmallFigure: {
    maxWidth: '20%',
    marginTop: '20px',
  },
}));
