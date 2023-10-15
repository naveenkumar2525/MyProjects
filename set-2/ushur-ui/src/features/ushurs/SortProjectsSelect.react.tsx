import React, { useState } from "react";
import { Dropdown, DropdownButton } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBarsSort,
  faArrowDownAZ,
  faArrowUpAZ,
} from "@fortawesome/pro-solid-svg-icons";
import "./SortProjectsSelect.css";

type Props = {
  onChange: (type: string) => any;
};

const labelsMap: any = {
  // @ts-ignore
  recent: [<FontAwesomeIcon icon={faBarsSort} />, "Sort by Recent", "Recent"],
  name_asc: [
    // @ts-ignore
    <FontAwesomeIcon icon={faArrowDownAZ} />,
    "Sort by Name",
    "Name",
    "(ascending)",
  ],
  name_dsc: [
    // @ts-ignore
    <FontAwesomeIcon icon={faArrowUpAZ} />,
    "Sort by Name",
    "Name",
    "(descending)",
  ],
};

const Title = ({ icon, label }: any) => {
  return (
    <div style={{ display: "flex", position: "relative" }}>
      <span className="title-box" style={{ paddingLeft: 12, color: "#2F80ED" }}>
        {/* @ts-ignore */}
        {icon}&nbsp;&nbsp;
        {label}
      </span>
      <span
        style={{
          display: "inline",
          position: "absolute",
          left: "177.5px",
          top: "5px",
        }}
      >
        {/* @ts-ignore */}
        <i bsPrefix="chevron-up-custom" className="bi bi-chevron-up"></i>
      </span>
    </div>
  );
};

const SortProjectsSelect = (props: Props) => {
  const { onChange } = props;
  const [selected, setSelected] = useState("recent");

  const onChangeSelection = (type: string) => {
    setSelected(type);
    onChange(type);
  };

  return (
    <div className="sort-projects-select">
      <DropdownButton
        bsPrefix="custom-dropdown"
        id="dropdown-basic-button"
        title={
          <Title icon={labelsMap[selected][0]} label={labelsMap[selected][1]} />
        }
      >
        <div
          style={{
            maxHeight: "142px",
            overflow: "hidden",
            padding: "1px 3.05px 10px 0px",
          }}
        >
          <div className="dropdown-container">
            <Dropdown.Header bsPrefix="dropdown-header">
              Sort Projects By
            </Dropdown.Header>
            {Object.entries(labelsMap).map(
              ([key, [icon, _, title, subTitle]]: any) => (
                <div
                  key={key}
                  style={{ color: selected === key ? "#2F80ED" : "#000" }}
                >
                  <Dropdown.Item
                    onClick={() => onChangeSelection(key)}
                    bsPrefix="dropdown-item"
                    className={selected === key ? 'selected' : ''}
                  >
                    {icon}&nbsp;&nbsp;
                    <span>{title}</span>&nbsp;
                    {subTitle && (
                      <span
                        style={{ color: selected === key ? "#2F80ED" : "#CCC" }}
                      >
                        {subTitle}
                      </span>
                    )}
                  </Dropdown.Item>
                </div>
              )
            )}
          </div>
        </div>
      </DropdownButton>
    </div>
  );
};

export default SortProjectsSelect;
