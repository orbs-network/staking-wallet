import React, { useMemo } from 'react';

export function useStringOrElement(stringOrElement: string | React.ElementType) {
  const renderableElement = useMemo(() => {
    if (typeof stringOrElement === 'string') {
      return stringOrElement;
    } else {
      const Renderable = stringOrElement;
      return <Renderable />;
    }
  }, [stringOrElement]);

  return renderableElement;
}
