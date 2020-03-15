import React, { useMemo } from 'react';
import NumberFormat from 'react-number-format';
import { useTheme } from '@material-ui/core';

interface INumberFormatCustomProps {
  // Usage props
  allowNegative?: boolean;
  suffix?: string;

  // Input obligatory fields
  inputRef: (instance: NumberFormat | null) => void;
  onChange: (event: { target: { value: string } }) => void;

  // Style props
  fontSize?: number;
}

export function NumberFormatCustom(props: INumberFormatCustomProps) {
  const { inputRef, onChange, allowNegative, suffix, fontSize, ...others } = props;

  const theme = useTheme();
  console.log(theme.typography.h3);
  console.log(others);

  const style = useMemo<React.CSSProperties>(() => {
    const styleObject: React.CSSProperties = {
      textAlign: 'center',
    };

    console.log(fontSize);

    if (fontSize) {
      styleObject.fontSize = fontSize;
    }

    return styleObject;
  }, [fontSize]);

  return (
    <NumberFormat
      {...others}
      getInputRef={inputRef}
      onValueChange={values => {
        console.log(values);
        onChange({
          target: {
            value: values.value,
          },
        });
      }}
      thousandSeparator
      isNumericString
      allowNegative={!!allowNegative}
      suffix={suffix}
      style={style}
    />
  );
}
