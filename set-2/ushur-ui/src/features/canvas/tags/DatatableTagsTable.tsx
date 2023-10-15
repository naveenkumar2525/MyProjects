import { useState, useEffect, useCallback, useContext } from "react";
import { Table } from "@ushurengg/uicomponents";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faDatabase } from "@fortawesome/pro-solid-svg-icons";
import keys from "lodash/keys";
import { useAppSelector } from "../../../app/hooks";
import { datatableTagsResponse } from "../data/canvasSlice";
import TagsContext from "./Context";

const DatatableTagsTable = () => {
  const datatableTags = useAppSelector(datatableTagsResponse);
  const { saveToTagModalState, setSaveToTagModalState } =
    useContext(TagsContext);
  const [tableData, setTableData] = useState<Record<string, string>[]>([]);

  useEffect(() => {
    const data: Record<string, string>[] = [];

    datatableTags?.content?.map((item) => {
      keys(item)
        .filter((key) => key !== "_id")
        .map((key) => {
          data.push(item[key] as Record<string, string>);
          return key;
        });

      return item;
    });

    setTableData(data);
  }, [datatableTags]);

  const saveOutputTag = (outputTag: Record<string, string> | null) => {
    setSaveToTagModalState((prevState) => ({
      ...prevState,
      outputTag,
    }));
  };

  const handleRowClick = useCallback(
    (event: Event, row: Record<string, string>) => {
      const { outputTag } = saveToTagModalState;

      if (outputTag !== null && outputTag?.id === row.id) {
        return saveOutputTag(null);
      }

      return saveOutputTag(row);
    },
    [saveToTagModalState]
  );

  const columnFormatter = (cell: string, row: Record<string, string>) => {
    const { outputTag } = saveToTagModalState;

    if (outputTag?.id === row.id) {
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
        <FontAwesomeIcon icon={faDatabase as IconProp} size="sm" />
        <span className="ml-1 text-sm font-bold">Datatables</span>
      </div>

      <div className={tableData.length ? "mb-4" : "mb-0"}>
        <Table
          keyField="desc"
          handleRowClick={handleRowClick}
          columns={[
            {
              dataField: "",
              hidden: false,
              sort: false,
              text: "Datatable",
              style: columnFormatter,
            },
            {
              dataField: "desc",
              hidden: false,
              sort: false,
              text: "Property",
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

export default DatatableTagsTable;
