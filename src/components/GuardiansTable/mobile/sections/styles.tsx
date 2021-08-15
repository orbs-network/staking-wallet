import { makeStyles } from '@material-ui/core/styles';

export const useCommonStyles = makeStyles({
  container: {
    position: 'relative',
  },
  name: {
    fontWeight: 600,
    fontSize: '16px',
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '13px',

    '& *': {
      fontWeight: 600,
      fontSize: '14px',
      wordBreak: 'break-word',
    },
  },
  rowName: {
    paddingRight: '15px',
    width: '140px',
    display: 'flex',
    alignItems: 'center',
  },
  rowContent: {
    width: 'calc(100% - 140px)',

    display: 'flex',
    alignItems: 'center',
  },
  line: { width: 'calc(100% - 55px)' },
  lineText: {
    marginLeft: 'auto',
  },
  textOverflow: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  text: {
    color: 'white',
    textDecoration: 'none',
  },
});
