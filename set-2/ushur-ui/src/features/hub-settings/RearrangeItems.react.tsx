import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { workflowGroupChanges } from "./hubSettingsSlice";
import "./RearrangeItems.css";

type RearrangeItemsProps = {};

const defaultData: any = Array.from({ length: 9 }, (_: any, i: number) =>
  String.fromCharCode("A".charCodeAt(0) + i)
);
// const defaultData = Array.from({ length: 9 }, (_: any, i: number) => "");

const RearrangeItems = () => {
  const wgChanges = useAppSelector(workflowGroupChanges);
  const dispatch = useAppDispatch();
  const [data, setData] = useState(defaultData);
  const [files, setFiles]: any = useState([]);

  useEffect(() => {
    const changes = Object.values(wgChanges)
      .filter(({ deleted = false }: any) => !deleted)
      .map((x: any) => {
        return {
          id: x.id,
          friendlyName: x.friendlyName
        };
      })
      .filter((x) => x);
    setData(
      data
        .map((item: any, i: number) => changes?.[i] ?? {})
        .filter(({ deleted = false }: any) => !deleted)
    );
    const files: any = {};
    Object.values(wgChanges).forEach(
      (item: any) => (files[item.id] = item.base64Logo)
    );
    setFiles(files);
  }, [wgChanges]);

  return (
    <div className="bg-gray-100 p-16 mt-4 flex flex-wrap gap-3 border-2 border-gray-200 rounded">
      {data.map((item: any, i: number) => (
        <div
          className="ra_item bg-gray-200 grid place-items-center"
          draggable={true}
          onDragStart={(event: any) => {
            event.dataTransfer.setData("text/plain", item);
          }}
          onDragOver={(event: any) => {
            event.preventDefault();
            event.dataTransfer.dropEffect = "move";
          }}
          onDrop={(event: any) => {
            event.preventDefault();

            const draggedItem = event.dataTransfer.getData("text/plain");
            const newData = [...data];
            const item = newData.splice(data.indexOf(draggedItem), 1);
            newData.splice(i, 0, item?.[0]);
            setData(newData);
            console.log("dropped", draggedItem, i, item, newData);
          }}
          key={defaultData[i]}
        >
          <div className="grid place-items-center p-4 text-center">
            {files?.[item.id] && <img src={files[item.id]} width={80} height={80} />}
            {item.friendlyName || ''}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RearrangeItems;
