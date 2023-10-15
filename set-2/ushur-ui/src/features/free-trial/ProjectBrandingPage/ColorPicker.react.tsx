import React from "react";
import styles from "./ProjectBrandingModal.module.css";

type ColorPickerProps = {
  title: string;
  color: string;
  onChangeColor: (color: string) => any;
};

const ColorPicker = (props: ColorPickerProps) => {
  const { color, onChangeColor, title } = props;

  return (
    <div className={styles.colorPicker}>
      <p className="ushur-label form-label mt-2">{title}</p>
      <div className="border-solid border-1 border-light-gray-200 rounded flex p-1">
        <input
          type="color"
          className="align-bottom mr-2 w-6 h-6 rounded"
          value={color}
          onChange={(event: any) => onChangeColor(event.target.value)}
        />
        <input
          type="text"
          className="w-fit h-6 text-base font-light"
          value={color}
          onChange={(event: any) => onChangeColor(event.target.value)}
        />
      </div>
    </div>
  );
};

export default ColorPicker;
