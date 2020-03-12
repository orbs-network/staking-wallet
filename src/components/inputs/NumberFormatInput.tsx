import React from 'react';
import NumberFormat from 'react-number-format';

interface INumberFormatCustomProps {
  // Usage props
  allowNegative?: boolean;
  suffix?: string;

  // Input obligatory fields
  inputRef: (instance: NumberFormat | null) => void;
  onChange: (event: { target: { value: string } }) => void;
}

export function NumberFormatCustom(props: INumberFormatCustomProps) {
  const { inputRef, onChange, allowNegative, suffix, ...others } = props;

  console.log(others);

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
    />
  );
}
