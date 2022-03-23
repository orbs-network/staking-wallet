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
    height: 40 
  },
  logo: {
    marginRight: 10,
    width: 17,
    height: 17,
    objectFit: 'contain',
    [theme.breakpoints.down('sm')]: {
     
    },
  },
  name: {
    textTransform: 'none',
    [theme.breakpoints.down('sm')]: {
     
    },
  },
  root: {
    display: 'flex',
    width: '100%',
    position: 'relative',
  
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
    width: '100%',
    padding: 0,
    paddingRight: 12,
    display: 'flex',
    justifyContent: 'flex-start',
    [theme.breakpoints.down('sm')]: {
    },
  },
  selectorArrow: {
    marginLeft: 'auto',
  },
  container: {
    width: '100%',
    [theme.breakpoints.down('sm')]: {
    
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
