import React, { useState } from "react";
import { Dropdown, DropdownButton } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowDownWideShort,
  faArrowUpShortWide,
} from "@fortawesome/pro-solid-svg-icons";
import styles from "./SortActivitySelect.module.css";

type Props = {
  onChange: (type: SortType) => any;
};

type SortType = "asc" | "dsc";

const labelsMap: { [key: string]: [any, string] } = {
  dsc: [
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    <FontAwesomeIcon icon={faArrowDownWideShort} />,
    "Sort by oldest first",
  ],
  asc: [
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    <FontAwesomeIcon icon={faArrowUpShortWide} />,
    "Sort by newest first",
  ],
};

const Title = ({ icon, label }: any) => (
  <div className="flex relative">
    <span className="title-box" style={{ paddingLeft: 12, color: "#2F80ED" }}>
      {icon}&nbsp;&nbsp;
      {label}
    </span>
    <span className="grid place-content-center">
      {/*  eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/* @ts-ignore */}
      <i bsPrefix="chevron-up-custom" className="bi bi-chevron-up" />
    </span>
  </div>
);

const SortActivitySelect = (props: Props) => {
  const { onChange } = props;
  const [selected, setSelected] = useState<SortType>("dsc");

  const onChangeSelection = (type: SortType) => {
    setSelected(type);
    onChange(type);
  };

  return (
    <div className={`${styles.container} mx-2`}>
      <DropdownButton
        bsPrefix="custom-dropdown"
        id="dropdown-basic-button"
        title={
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
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
              Sort Activity By
            </Dropdown.Header>
            {Object.entries(labelsMap).map(
              ([key, [icon, title]]: [string, any]) => (
                <div
                  key={key}
                  style={{ color: selected === key ? "#2F80ED" : "#000" }}
                >
                  <Dropdown.Item
                    onClick={() => onChangeSelection(key as SortType)}
                    bsPrefix="dropdown-item"
                  >
                    {icon}&nbsp;&nbsp;
                    <span>{title}</span>&nbsp;
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

export default SortActivitySelect;
