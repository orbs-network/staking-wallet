import React, { useCallback, useEffect, useState } from 'react';

export default function useScrollDirection() {
  const [y, setY] = useState(document.scrollingElement.scrollHeight);
  const [scrollingTop, setScrollingUp] = useState(true);
  const handleNavigation = useCallback(
    (e) => {
      if (y > window.scrollY) {
        setScrollingUp(true);
      } else if (y < window.scrollY) {
        setScrollingUp(false);
      }
      setY(window.scrollY);
    },
    [y],
  );

  useEffect(() => {
    window.addEventListener('scroll', handleNavigation);

    return () => {
      window.removeEventListener('scroll', handleNavigation);
    };
  }, [handleNavigation]);
  return scrollingTop;
}
