import React, { useState } from "react";

type DropFileProps = {
  id?: string
  label?: string;
  infoText?: string;
  supportedText?: string | React.ReactNode;
  onChange: (file: any) => void;
};

const defaults = {
  id: "file_picker",
  label: "Upload File",
  infoText: "DROP OR SELECT FILE TO UPLOAD",
  supportedText: "supported formats: .img, .jpg, .gif, .png",
};

const DropFile = (props: DropFileProps) => {
  const {
    id = defaults.id,
    label = defaults.label,
    infoText = defaults.infoText,
    supportedText = defaults.supportedText,
    onChange,
  } = props;
  const [droppedFile, setDroppedFile]: any = useState("");

  const onDropHandler = (ev: any) => {
    ev.preventDefault();

    let file = "";
    if (ev.dataTransfer.items) {
      // Use DataTransferItemList interface to access the file(s)
      file =
        [...ev.dataTransfer.items]
          ?.find((item: any) => item.kind === "file")
          ?.getAsFile() ?? "";
    } else {
      // Use DataTransfer interface to access the file(s)
      file = ev.dataTransfer.files?.[0] ?? "";
    }
    setDroppedFile(file);
    onChange(file);
  };

  const onDragOver = (ev: any) => ev.preventDefault();

  return (
    <div>
      <label className="ushur-label form-label mt-10">
        {label}
        {droppedFile?.name && (
          <span className="text-blue-500 font-semibold m-2">
            {droppedFile?.name ?? ""}
          </span>
        )}
      </label>
      <div
        className="grid grid-cols-1 h-36 place-items-center bg-gray-200 p-3"
        onDrop={onDropHandler}
        onDragOver={onDragOver}
      >
        <div className="border-2 border-dashed border-gray-500 w-full h-full grid place-items-center text-sm p-3">
          <div className="grid place-items-center">
            <div>
              <i className="bi bi-upload"></i>
            </div>
            <label>Drag and drop here</label>
            <label>or</label>
            <label
              htmlFor={id}
              style={{ color: "#2F80ED" }}
              className="px-2 cursor-pointer"
            >
              Browse files
            </label>
            <input
              id={id}
              type="file"
              accept="text/csv/png/jpg/jpeg/img/gif"
              onChange={(ev: any) => {
                const file = ev.target.files?.[0];
                if (file) {
                  setDroppedFile(file);
                  onChange(file);
                }
              }}
              className="hidden"
            ></input>
          </div>
        </div>
      </div>
      <p className="text-sm text-gray-400 pl-2">{supportedText}</p>
    </div>
  );
};

export default DropFile;
