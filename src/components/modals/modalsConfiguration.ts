// DEV_NOTE : O.L : For now the theme properties here area hard coded. we can consider using 'styled components' later if needed.
import { baseTheme } from '../../theme/Theme';
import Color from 'color';

export const MODAL_CSTYLE_ENTERED_CONTENTS = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: Color(baseTheme.palette.primary.main).fade(1).rgb().string(),
    border: 'none',
  },
  overlay: {
    backgroundColor: Color(baseTheme.palette.primary.main).rgb().fade(0.05).string(),
  },
};
