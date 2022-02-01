import { withStyles, Theme, makeStyles } from '@material-ui/core/styles';
import Tooltip, { TooltipProps } from '@material-ui/core/Tooltip';

export const HtmlTooltip = withStyles((theme: Theme) => ({
  tooltip: {
    backgroundColor: '#282828',
    color: 'white',
    // maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    lineHeight: '16px',
    fontWeight: 400,
    padding: 10,
  },
  arrow: {
    color: '#282828',
    '&::before': {
      color: '#282828',
    },
  },
}))(Tooltip);
