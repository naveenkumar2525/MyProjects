/* eslint-disable react/require-default-props */
import {
  ChangeEvent,
  ReactElement,
  Dispatch,
  SetStateAction,
  useCallback,
} from "react";
import { useAppDispatch } from "../../../app/hooks";
import { startBatch, stopBatch } from "../data/canvasSlice";

interface Props {
  cellId: string;
  className?: string;
  placeholder: string;
  type?: string;
  spellCheck?: boolean;
  defaultValue: string;
  setCheck: Dispatch<SetStateAction<{ [key: string]: boolean }>>;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

const InspectorInput = (props: Props): ReactElement => {
  const {
    className,
    type,
    spellCheck,
    onChange,
    setCheck,
    defaultValue,
    cellId,
    placeholder,
  } = props;

  const dispatch = useAppDispatch();

  const onFocus = (): void => {
    dispatch(startBatch);
  };

  const onBlur = (): void => {
    dispatch(stopBatch);
    setCheck({ [cellId]: false });
  };
  const autoFocus = useCallback(
    (el: HTMLInputElement | null) => (el ? el.focus() : null),
    []
  );

  return (
    <input
      className={`${className ?? " "}`}
      type={type}
      placeholder={placeholder}
      spellCheck={"spellCheck" in props ? spellCheck : true}
      defaultValue={defaultValue}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
      name={defaultValue}
      data-toggle="tooltip"
      data-placement="top"
      autoComplete="off"
      ref={autoFocus}
      autoCapitalize="on"
    />
  );
};

export default InspectorInput;
