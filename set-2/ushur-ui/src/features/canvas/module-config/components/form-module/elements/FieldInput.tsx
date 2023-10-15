import { Input } from "@ushurengg/uicomponents";
import { ChangeEvent, FocusEvent } from "react";

export type InputProps = {
  type?: string | "";
  label?: string | "";
  placeholder?: string;
  value?: string | "";
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
};

const FieldInput = (props: InputProps) => {
  const { type, label, value, placeholder, onBlur, onChange } = props;

  return (
    <Input
      type={type}
      label={label}
      defaultValue={value}
      placeholder={placeholder}
      onBlur={onBlur}
      onChange={onChange}
    />
  );
};

FieldInput.defaultProps = {
  label: "Text input",
  placeholder: "Provide a field label",
};

export default FieldInput;
