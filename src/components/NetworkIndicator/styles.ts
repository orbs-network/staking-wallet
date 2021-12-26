import { Theme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme: Theme) => ({
  item: {
    paddingLeft: 20,
    paddingRight: 20,
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      paddingLeft: 10,
    paddingRight: 10,
    },
  },
  logo: {
    marginRight: 14,
    width: 22,
    height: 22,
    objectFit: 'contain',
    [theme.breakpoints.down('sm')]: {
      marginRight: '0px',
    },
  },
  name: {
    textTransform: 'none',
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  root: {
    display: 'flex',
  },
  paper: {
    marginRight: 20,
  },
  selector: {
    background: 'rgba(21, 61, 111, 0.44)',
    height: '40px',
  },
}));

export default useStyles;
