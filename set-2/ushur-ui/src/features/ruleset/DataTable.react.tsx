import React, { useState, useEffect } from "react";
import { Route, useHistory } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  createResponse,
  getRulesetsList,
  searchText,
  rulesList,
} from "./rulesetSlice";
// @ts-ignore
import {
  Button,
  Link,
  Modal,
  Table,
  // @ts-ignore
} from "@ushurengg/uicomponents";
import "./Datatable.css";
import Status from "./Status.react";
import CreateRulesetModal from "./CreateRulesetModal.react";
const statusCell = (cell: any, row: any) => {
  return <Status text={cell} />;
};

// function ListItemLink( to:any, ...rest:any) {
//   return (
//     <Route
//       path={to}
//       children={({ match }) => (
//         <Link to={to} {...rest}>TEXT</Link>
//       )}
//     />
//   );
// }

const nameCell = (cell: any, row: any) => {
  const href = "./?page=edit_ruleset/" + row["rulesetId"];
  //return <ListItemLink to={href}>{cell}</ListItemLink>
  return (
    <Link href={href} to={href}>
      {cell}
    </Link>
  );
};
// const ushursCell = (cell: any, row: any) => {

//   let total = cell.total ? `<span class='ushur-pill'>` + cell.total + `</span>`:"";
//   let active = cell.active ? `<span >` + cell.active + " Active" + `</span>`:"";
//   let inactive = cell.inactive ? `<span >` + cell.inactive + " Inactive" + `</span>`:"";
//   return <div dangerouslySetInnerHTML={{__html:total + " " + active + " " + inactive}}></div>;
// };

const columns = [
  // {
  //   dataField: "rulesetId",
  //   sort: false,
  //   text: "rulesetid",
  //   //formatter:editCell,
  //   classes:"id-cell",
  //   headerStyle: { width: '100px' }
  // },

  {
    dataField: "rulesetName",
    sort: true,
    text: "RULESET NAME",
    // formatter:nameCell,
    classes: "name-cell",
    headerStyle: { width: "200px" },
  },
  {
    dataField: "description",
    sort: true,
    text: "DESCRIPTION",
    classes: "name-cell",
    headerStyle: { width: "200px" },
  },
];

const DataTable = () => {
  const history = useHistory();
  const list = useAppSelector(rulesList);
  const createResp = useAppSelector(createResponse);
  const text = useAppSelector(searchText);
  const dispatch = useAppDispatch();

  const [editTable, setEditTable] = useState<any>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<any>(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  useEffect(() => {
    dispatch(getRulesetsList({}));
  }, []);

  useEffect(() => {
    if (createResp) {
      dispatch(getRulesetsList({}));
    }
  }, [createResp]);

  const handleEdit = () => {
    setEditTable(true);
  };

  const handleEditCancel = () => {
    setEditTable(false);
  };

  const saveEditChanges = () => {
    //dispatch(editVariableAPI({ editVariablesList }));
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
  };
  const handleRowClick = (e: any, row: any) => {
    const rulesetid = row.rulesetId ? row.rulesetId : "";
    location.href = "?page=edit_ruleset&rulesetid=" + rulesetid;
    //history.push("?page=edit_ruleset/" + rulesetid,{from: "Ruleset"}); Will be required later, when we move away from iframe for react project
  };
  let allListPageSize: number = list?.length ?? 50;
  let pageSizes = [
    {
      text: "50",
      value: 50,
    },
    {
      text: "100",
      value: 100,
    }
  ]
  if(allListPageSize > 0){
    pageSizes.push({
      text: "All",
      value: allListPageSize,
    })
  }
  return (
    <div style={{ padding: 20 }} className="rule-sets">
      <CreateRulesetModal
        open={createDialogOpen}
        onClose={() => {
          setCreateDialogOpen(false);
        }}
      />

      <Table
        keyField="rulesetid"
        columns={columns}
        data={
          text
            ? list.filter((item: any) => JSON.stringify(item).includes(text))
            : list
        }
        pageSizes={pageSizes}
        showHeader={true}
        showSettings={false}
        headerComponent={
          <Button
            label="Create New Ruleset"
            onClick={() => {
              setCreateDialogOpen(true);
            }}
            type="toolbar"
          />
        }
        showEdit={false}
        showSearch={false}
        editTable={editTable}
        editClickHandler={handleEdit}
        handleEditCancel={handleEditCancel}
        noDataComponent={() => (
          <div className="nodata">
            No rulesets exist,{" "}
            <Link href="#" onClick={() => setCreateDialogOpen(true)}>
              create new ruleset
            </Link>{" "}
            to get started
          </div>
        )}
        handleRowClick={handleRowClick}
      />
    </div>
  );
};

export default DataTable;
