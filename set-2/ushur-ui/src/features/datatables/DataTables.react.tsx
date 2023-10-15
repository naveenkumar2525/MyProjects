import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Title,
  // @ts-ignore
} from "@ushurengg/uicomponents";
import { useAppDispatch } from "../../app/hooks";
import useUrlSearchParams from "../../custom-hooks/useUrlSearchParams";
import MetadataPage from "../metadata/metadata.react";
import AppContextDropdown from "../../components/AppContextDropdown.react";

import { getMetaDataCountAPI } from "../metadata/metadataSlice";
import {
  getVariablesList,
  getKeysListAPI,
  getVariableTypes,
} from "../variables/variablesSlice";
import DataCards from "../metadata/DataCard.react";
import "./DataTables.css";

const Datatables = () => {
  const { page, project } = useUrlSearchParams();
  const { t } = useTranslation("translation", { keyPrefix: "dataTables" });

  const [refreshPaginationCount, setRefreshPaginationCount] =
    useState<number>(0);
  const [curAppContext, setCurAppContext] = useState<string>("");

  const dispatch = useAppDispatch();

  const handleProjectChange = (selectedProject: string) => {
    setRefreshPaginationCount((count: number) => count + 1);
    localStorage.setItem("appContext", selectedProject);
    setCurAppContext(selectedProject);
  };

  useEffect(() => {
    dispatch(getMetaDataCountAPI());
    dispatch(getKeysListAPI());
    dispatch(getVariablesList());
    dispatch(getVariableTypes());
  }, []);

  return (
    <div className="p-3 m-0">
      <div className="container-fluid variables-page p-3">
        {(!page || project) && (
          <div className="row m-0 mb-4">
            <div className="col-12 p-0">
              <Title subText={t("subTitle")} text={t("title")} />
            </div>
          </div>
        )}
        <div className="row m-0 mb-3">
          <div className="col-12 p-0 d-flex">
            <AppContextDropdown
              handleProjectChange={handleProjectChange}
              containerWidth={320}
            />
            <DataCards />
          </div>
        </div>
        <MetadataPage
          curAppContext={curAppContext}
          setCurAppContext={setCurAppContext}
          refreshPaginationCount={refreshPaginationCount}
        />
      </div>
    </div>
  );
};

export default Datatables;
