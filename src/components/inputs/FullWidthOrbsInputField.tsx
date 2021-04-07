import React from 'react';
import { NumberFormatCustom } from './NumberFormatInput';
import { TextField } from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import useTheme from '@material-ui/core/styles/useTheme';
import { CSSProperties } from '@material-ui/core/styles/withStyles';

interface IProps {
  id: string;
  label?: string;
  value: number | string;
  onChange: (newValue: number) => void;
  disabled?: boolean;
  placeholder?: string;
  customStyle?: CSSProperties;
}

export const FullWidthOrbsInputField = React.memo<IProps>((props) => {
  const { id, label, value, onChange, disabled, placeholder, customStyle } = props;

  const theme = useTheme();

  const largerThanSmall = useMediaQuery(theme.breakpoints.up('sm'));
  const fontSize = largerThanSmall ? theme.typography.h2.fontSize : theme.typography.h3.fontSize;
  const val = value || '';
  const inputStyle = {
    width: '100%',
  };
  const style: CSSProperties = customStyle ? { ...inputStyle, ...customStyle } : inputStyle;
  return (
    <TextField
      id={id}
      label={label}
      value={val}
      placeholder={placeholder}
      onChange={(e) => onChange(parseInt(e.target.value))}
      InputProps={{
        inputComponent: NumberFormatCustom as any,
        inputProps: {
          suffix: ' ORBS',
          fontSize: fontSize,
        },
      }}
      disabled={disabled}
      style={style}
    />
  );
});
