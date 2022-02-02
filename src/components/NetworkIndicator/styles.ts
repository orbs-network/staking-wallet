import { Theme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme: Theme) => ({
  item: {
    width: '100%',
    paddingLeft: 10,
    paddingRight: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    [theme.breakpoints.down('sm')]: {
      justifyContent: 'center',
    },
  },
  listItem: {
    padding: 0,
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
  list: {
    width: '100%',
  },
  selector: {
    background: '#152136',
    height: '40px',
    width: 211,
    padding: 0,
    [theme.breakpoints.down('sm')]: {
      width: 'auto',
    },
  },
  container: {
    width: 211,
    [theme.breakpoints.down('sm')]: {
      width: 'auto',
    },
  },
  tooltipText: {
    fontSize: 16,
    lineHeight: '20px',
    padding: 10,
    margin: 0,
  },
}));

export default useStyles;
