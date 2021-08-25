import { makeStyles } from '@material-ui/core/styles';

const useErrorStyles = makeStyles((theme) => ({
  errorWrapper: {
    position: 'relative',
  },
  childrenError: {
    visibility: 'hidden',
  },
  baseErrorText: {
    color: 'white',
    fontSize: 26,
  },
  baseError: {
    height: '200px',
    paddingTop: '30px',
  },
  crashError: {
    position: 'fixed',
    width: 'fit-content',
    height: 'auto',
    display: 'flex',
    flexDirection: 'column',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    border: '1px solid white',
    alignItems: 'center',
    padding: '40px',
    justifyContent: 'center',
  },
  crashErrorBtn: {
    marginTop: '40px',
    paddingLeft: '20px',
    paddingRight: '20px',
    background: 'white',
    color: 'black',
  },
}));
export default useErrorStyles;
