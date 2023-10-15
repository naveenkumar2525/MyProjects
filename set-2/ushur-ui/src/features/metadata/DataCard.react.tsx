import React, { useState, useEffect } from "react";
import {
  DataCard,
  // @ts-ignore
} from "@ushurengg/uicomponents";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useAppSelector } from "../../app/hooks";
import { ErrorIcon } from "../ushurs/SvgIcons.react";
import { faKeySkeleton } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import "./Datatable.css";
import { 
  variablesList,
  keysList,
  encryptTotalCount,
  getTotalVariableCount,
} from "../variables/variablesSlice";
import { metaDataCount } from "./metadataSlice"
import { dataSecurityRule } from "./dataPropertiesSlice";

const DataCards = () => {
  const latestMetaDataCount = useAppSelector(metaDataCount);
  const currentDataSecurityRule = useAppSelector(dataSecurityRule);
  const list = useAppSelector(variablesList);
  const listOfKeys = useAppSelector(keysList);
  const [currentKeysList, setCurrentKeysList] = useState<any>([]);
  const [currentVariablesList, setCurrentVariablesList] = useState<any>(0);
  const [encryptCount, setEncryptCount] = useState<any>("");

  useEffect(() => {
    setCurrentVariablesList(getTotalVariableCount(list));
    setEncryptCount(encryptTotalCount(list));
  }, [list]);

  useEffect(() => {
    if (
      listOfKeys?.content?.[0]?.OR?.length > 0
    ) {
      setCurrentKeysList(listOfKeys.content[0].OR);
    } else {
      setCurrentKeysList([]);
    }
  }, [listOfKeys]);

  const primaryKeyData = (
    <span className="dataCard-primary-Key-Content">
      <span className="dataCard-primary-Key-Text">Unique Keys</span>
      {currentKeysList.length == 0 ? (
        <OverlayTrigger
          placement="bottom"
          trigger="hover"
          overlay={
            <Tooltip className="custom-tooltips" id="tooltip-top">
              <span>
                {"To use this datatable, at least one property "}
                <span className="error-toottip-text">
                  must be used as a unique Key
                  <FontAwesomeIcon
                    className="pull-tags-key-icon"
                    icon={faKeySkeleton as IconProp}
                    color="#d3d3d3"
                    size={"lg"}
                  />
                  .
                </span>
              </span>
            </Tooltip>
          }
        >
          <div>
            <ErrorIcon
              className="error-tooltip-icon"
              height="12"
              width="12"
            />
          </div>
        </OverlayTrigger>
      ) : (
        ""
      )}
    </span>
  );

  return (
    <>
      {latestMetaDataCount != 0 ? (
        <DataCard
          data={latestMetaDataCount}
          label="Total entries"
          style={{ marginRight: "16px" }}
        />
      ) : (
        ""
      )}
      {currentVariablesList != 0 ? (
        <DataCard
          data={currentVariablesList}
          label="Datatable properties"
          style={{ marginRight: "16px" }}
        />
      ) : (
        ""
      )}

      <DataCard
        data={currentKeysList.length}
        label={primaryKeyData}
        className={
          currentKeysList.length == 0
            ? "primary-key"
            : ""
        }
        style={{ marginRight: "16px", color: "red" }}
      />
      {encryptCount != 0 && currentDataSecurityRule?.data?.GlobalDataSecurity === "Yes"? (
        <DataCard
          data={encryptCount}
          label="Encrypted properties"
          style={{ marginRight: "16px" }}
        />
      ) : (
        ""
      )}
    </>
  );
};

export default DataCards;