import React from 'react';
import { MaxButton } from './max-button';
import { FullWidthOrbsInputField } from '../../components/inputs/FullWidthOrbsInputField';

interface IProps {
  handleMax: () => void;
  showMaxBtn: boolean;
  placeholder: string;
  id: string;
  value: string;
  onChange: (e: string) => void;
  disabled: boolean;
  maxText: string;
  children?: JSX.Element;
}
const StakingInput = ({
  handleMax,
  showMaxBtn,
  placeholder,
  id,
  value,
  onChange,
  disabled,
  maxText,
  children,
}: IProps) => {
  const maxBtn = (
    <MaxButton disabled={!showMaxBtn} onClick={handleMax}>
      {maxText}
    </MaxButton>
  );
  return (
    <>
      {children}
      <FullWidthOrbsInputField
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={(value) => onChange(value)}
        disabled={disabled}
        buttonComponent={maxBtn}
      />
    </>
  );
};

export default StakingInput;
