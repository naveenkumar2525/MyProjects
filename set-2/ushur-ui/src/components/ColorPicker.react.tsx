import React from "react";

type ColorPickerProps = {
  title: string;
  color: string;
  onChangeColor: (color: string) => any;
};

const ColorPicker = (props: ColorPickerProps) => {
  const { color, onChangeColor, title } = props;

  return (
    <div>
      <p className="ushur-label form-label mt-10">{title}</p>
      <div className="border-solid border-1 border-light-gray-200 flex justify-space p-1">
        <input
          type="text"
          className="ushur-text align-bottom w-full"
          value={color}
          onChange={(event: any) => onChangeColor(event.target.value)}
        />
        <input
          type="color"
          className="align-bottom w-8 h-8"
          value={color}
          onChange={(event: any) => onChangeColor(event.target.value)}
        />
      </div>
    </div>
  );
};

export default ColorPicker;
