import { useState, useEffect, useCallback, useContext } from "react";
import { Table } from "@ushurengg/uicomponents";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faTag } from "@fortawesome/pro-solid-svg-icons";
import { useAppSelector } from "../../../app/hooks";
import { tagsResponse } from "../data/canvasSlice";
import TagsContext from "./Context";

const TagsTable = () => {
  const tags = useAppSelector(tagsResponse);
  const { saveToTagModalState, setSaveToTagModalState } =
    useContext(TagsContext);
  const [tableData, setTableData] = useState<Record<string, string>[]>([]);

  useEffect(() => {
    const data: Record<string, string>[] = [];

    tags?.content?.map((item) => {
      item.vars?.map((variable) => {
        data.push(variable);
        return variable;
      });

      return item;
    });

    setTableData(data);
  }, [tags]);

  const saveOutputTag = (outputTag: Record<string, string> | null) => {
    setSaveToTagModalState((prevState) => ({
      ...prevState,
      outputTag,
    }));
  };

  const handleRowClick = useCallback(
    (event: Event, row: Record<string, string>) => {
      const { outputTag } = saveToTagModalState;

      if (outputTag !== null && outputTag?.variable === row.variable) {
        return saveOutputTag(null);
      }

      return saveOutputTag(row);
    },
    [saveToTagModalState]
  );

  const columnFormatter = (cell: string, row: Record<string, string>) => {
    const { outputTag } = saveToTagModalState;

    if (outputTag?.variable === row.variable) {
      return {
        backgroundColor: "#d1f3ff",
      };
    }

    return {
      backgroundColor: "#fff",
    };
  };

  return (
    <>
      <div className="flex flex-nowrap items-center mb-2">
        <FontAwesomeIcon icon={faTag as IconProp} size="sm" />
        <span className="ml-1 text-sm font-bold">Tags</span>
      </div>

      <div className={tableData.length ? "mb-4" : "mb-0"}>
        <Table
          keyField="desc"
          handleRowClick={handleRowClick}
          columns={[
            {
              dataField: "desc",
              hidden: false,
              sort: false,
              text: "Tag Name",
              style: columnFormatter,
            },
            {
              dataField: "",
              hidden: false,
              sort: false,
              text: "Initial Value",
              style: columnFormatter,
            },
            {
              dataField: "type",
              hidden: false,
              sort: false,
              text: "Data Type",
              style: columnFormatter,
            },
          ]}
          data={tableData}
          originalData={tableData}
        />
      </div>
    </>
  );
};

export default TagsTable;
