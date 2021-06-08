import React, { FC, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { checkIfCharactersIncludes } from '../../utils/stringUtils';

interface IProps {
  amount: string;
  title: string;
  fullAmount: string;
}

interface IStylesProps {
  isHovered: boolean;
}
const useStyles = makeStyles({
  fullAmount: {
    opacity: (props: IStylesProps) => (props.isHovered ? 1 : 0),
    background: '#2f2f2f',
    borderRadius: '10px',
    padding: '10px 20px 10px 20px',
    width: 'fit-content',
    position: 'absolute',
    left: '50%',
    transform: 'translate(-50%)',
    top: 'calc(100% + 5px)',
    pointerEvents: 'none',
    fontSize: '1rem',
    transition: '0.2s all',
  },
  arrow: {
    position: 'absolute',
    height: '10px',
    width: '10px',
    left: '50%',
    top: '-2px',
    transform: 'rotate(45deg) translate(-50%)',
    background: '#2f2f2f',
  },
  root: {
    position: 'relative',
  },
});

const FullAmountTooltip: FC<IProps> = ({ title, amount, fullAmount }) => {
  const [isHovered, setHoverred] = useState<boolean>(false);
  const classes = useStyles({ isHovered });
  return (
    <div className={classes.root} onMouseEnter={() => setHoverred(true)} onMouseLeave={() => setHoverred(false)}>
      {title}
      {checkIfCharactersIncludes('...', amount) && (
        <div className={classes.fullAmount}>
          {fullAmount}
          <aside className={classes.arrow} />
        </div>
      )}
    </div>
  );
};

export default FullAmountTooltip;
