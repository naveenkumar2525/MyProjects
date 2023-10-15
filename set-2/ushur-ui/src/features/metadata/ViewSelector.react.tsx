import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDatabase, faTable } from "fontawesome-pro-regular-svg-icons";
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import styles from "./ViewSelector.module.css"

type ViewSelectorProps = {
  handleClickViewSelector: () => void;
  activeView: string;
}
const ViewSelector = (props: ViewSelectorProps) => {
  const { handleClickViewSelector, activeView } = props;

  return (
    <OverlayTrigger
      placement={"top"}
      overlay={
        <Tooltip className="tooltip" id="tooltip-top">
          Select view
        </Tooltip>
      }
    >
      <div className={styles.switchesContainer}>
        <input type="radio" id="data" name="switchView" value="data" checked={activeView === "data"} onClick={handleClickViewSelector} />
        <input type="radio" id="properties" name="switchView" value="properties" checked={activeView === "properties"} onClick={handleClickViewSelector} />
        <label htmlFor="data">
          <FontAwesomeIcon
            icon={faDatabase as IconProp}
            color="#d3d3d3"
            size={"lg"}
            className="ml-1"
          />
          Data
        </label>
        <label htmlFor="properties">
          <FontAwesomeIcon
            icon={faTable as IconProp}
            color="#d3d3d3"
            size={"lg"}
            className="ml-1"
          />
          Properties
        </label>
        <div className={styles.switchWrapper}>
          <div className={styles.switch}>
            <div>
              <FontAwesomeIcon
                icon={faDatabase as IconProp}
                color="#d3d3d3"
                size={"lg"}
                className="ml-1"
              />
              Data
            </div>
            <div>
              <FontAwesomeIcon
                icon={faTable as IconProp}
                color="#d3d3d3"
                size={"lg"}
                className="ml-1"
              />
              Properties
            </div>
          </div>
        </div>
      </div>
    </OverlayTrigger>
  )
}

export default ViewSelector;
