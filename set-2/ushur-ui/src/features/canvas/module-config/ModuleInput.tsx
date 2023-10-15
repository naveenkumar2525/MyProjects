/* eslint-disable react/require-default-props */
import { ReactElement } from "react";
import { useAppDispatch } from "../../../app/hooks";
import { startBatch, stopBatch } from "../data/canvasSlice";

const ModuleInput = (): ReactElement => {
  const dispatch = useAppDispatch();

  const onFocus = (): void => {
    dispatch(startBatch);
  };

  const onBlur = (): void => {
    dispatch(stopBatch);
  };

  return <input onFocus={onFocus} onBlur={onBlur} />;
};

export default ModuleInput;
