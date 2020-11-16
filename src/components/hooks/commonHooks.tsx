import React, { useMemo } from 'react';

export function useStringOrElement(stringOrElement: string | React.ElementType | JSX.Element) {
  const renderableElement = useMemo(() => {
    if (typeof stringOrElement === 'string') {
      // String
      return stringOrElement;
    } else if (typeof stringOrElement === 'function') {
      // React.ElementType function
      const Renderable = stringOrElement;
      return <Renderable />;
    } else {
      // JSX.Element
      return stringOrElement;
    }
  }, [stringOrElement]);

  return renderableElement;
}
