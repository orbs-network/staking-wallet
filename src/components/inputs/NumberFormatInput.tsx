import React, { useEffect, useMemo, useRef, useState } from 'react';
import NumberFormat, { NumberFormatProps } from 'react-number-format';
import { useTheme } from '@material-ui/core';
import { CSSProperties } from '@material-ui/core/styles/withStyles';

import constants from '../../constants/constants';
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

export function NumberFormatCustom(props: INumberFormatCustomProps & NumberFormatProps) {
  const { inputRef, onChange, allowNegative, suffix, fontSize, onBlur, onFocus, buttonComponent, ...others } = props;

  const ref = useRef<NumberFormat>();
  const btnRef = useRef<HTMLDivElement>(null);

  const style = useMemo<React.CSSProperties>(() => {
    const styleObject: React.CSSProperties = {
      textAlign: 'center',
      paddingRight: 10,
      paddingLeft: 10,
      background: 'transparent',
      border: 'none',
      color: 'white',
      outline: 'none',
    };

    if (fontSize) {
      styleObject.fontSize = fontSize;
    }

    return styleObject;
  }, [fontSize]);

  const blurStyle: CSSProperties = {
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  };

  const btnWidth = (btnRef.current && btnRef.current.clientWidth) || 0;

  return (
    <>
      <NumberFormat
        {...others}
        getInputRef={inputRef}
        onValueChange={({ value }) => {
          onChange({
            target: {
              value,
            },
          });
        }}
        // value={bigInt(String(props.value))}
        onBlur={onBlur}
        // onFocus={onFocus}
        onClickCapture={() => {
          // Dev Note : By design, zny leading zero will be removed only after focus lost.
          //            Our users, when on Mobile, will lose focus only when clicking the action button (and thus, will always have
          //            the less-than-idle UX of seeing a leading zero).
          //            What this little hack over here does is (and I am not 100% sure why though) keeping the zero displayed,
          //            and only after the user starts typing the actual desired amount, then the zero will disappear and only the
          //            intended amount will remain.
          if (ref.current) {
            // DEV_NOTE : the object has an 'onBlur' method, not sure as to why they typing do not include it.
            (ref.current as any).onBlur();
          }
        }}
        thousandSeparator
        decimalScale={constants.numbersDecimalToInsertLimit}
        allowNegative={false}
        isNumericString={false}
        allowLeadingZeros={false}
        suffix={suffix}
        ref={ref}
        style={{
          ...style,
          ...blurStyle,
          textIndent: btnWidth,
        }}
      />
      <div ref={btnRef}>{buttonComponent}</div>
    </>
  );
}
