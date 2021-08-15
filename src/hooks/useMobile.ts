import { useEffect, useState } from 'react';
import useWindowSize from './useResize';
import constants from '../constants/constants';

const useMobile = (): [boolean] => {
  const [isMobile, setIsMobile] = useState(false);
  const [width] = useWindowSize();

  useEffect(() => {
    if (width && width <= constants.mobile) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  }, [width]);

  return [isMobile];
};

export default useMobile;
