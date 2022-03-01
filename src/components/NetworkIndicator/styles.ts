import { Theme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme: Theme) => ({
  item: {
    paddingLeft: 13,
    paddingRight: 10,
    display: 'flex',
    height: '100%',
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
    marginRight: 10,
    width: 17,
    height: 17,
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
    height: 35,
    width: 211,
    padding: 0,
    paddingRight: 12,
    display: 'flex',
    justifyContent: 'flex-start',
    [theme.breakpoints.down('sm')]: {
      width: 'auto',
    },
  },
  selectorArrow: {
    marginLeft: 'auto',
  },
  container: {
    width: 211,
    [theme.breakpoints.down('sm')]: {
      width: 'auto',
    },
  },
  selectorInfoIcon: {
    width: '14px',
    height: '14px',
  },
  tooltipText: {
    fontSize: 16,
    lineHeight: '20px',
    padding: 10,
    margin: 0,
  },
}));

export default useStyles;
