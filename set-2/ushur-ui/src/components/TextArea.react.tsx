import React, { useState } from "react";

type TextAreaProps = {
  text: string;
  setText: (text: string) => void;
  label: string;
  placeholder?: string;
};

const TextArea = (props: TextAreaProps) => {
  const { text, setText, label, placeholder = "" } = props;
  return (
    <div>
      <p className="ushur-label form-label mt-10">{label}</p>
      <textarea
        className="ushur-text w-full border-solid border-1 border-light-grey-100"
        value={` ${text}`}
        onChange={(event: any) => setText(event.target.value?.slice(1))}
        rows={3}
        placeholder={placeholder}
      ></textarea>
    </div>
  );
};

export default TextArea;
