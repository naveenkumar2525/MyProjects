import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Dropdown, DropdownButton } from "react-bootstrap";
import { faPlus } from "fontawesome-pro-regular-svg-icons";
import './addMenuDropdown.css';

const AddMenuDropdown = (props: any) => {
  const { menuItems } = props;
  return (
    <>
      <div className="add-metadata">
        <DropdownButton
          bsPrefix="add-dropdown"
          id="dropdown-basic-button"
          title={
            <div
              style={{
                display: "flex",
                position: "relative",
              }}
            >
              <span
                className="title-box"
                style={{ paddingLeft: 2, color: "#2F80ED" }}
              >
                {
                  <FontAwesomeIcon
                    icon={faPlus as IconProp}
                    color="rgb(47, 128, 237)"
                    size={"sm"}
                  />
                }
                &nbsp;&nbsp;
                {"Add"}
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
                <i bsPrefix="chevron-up-custom"
                  className="bi bi-chevron-up"
                ></i>
              </span>
            </div>
          }
          style={{
            width: "max-content",
          }}
        >
          <div>
            <div className="dropdown-container">
              {
                menuItems.map((item: any) => {
                  if (item.type == "header") {
                    return (
                      <Dropdown.Header bsPrefix="dropdown-header">
                        {item.text}
                      </Dropdown.Header>
                    );
                  } else {
                    return (
                      <Dropdown.Item
                        onClick={item.action}
                        bsPrefix="dropdown-item"
                      >
                        <div className="add-menu-items">
                          <span className="menu-icon">
                            <FontAwesomeIcon
                              icon={item.icon as IconProp}
                              size="lg"
                              className="ml-2"
                            />
                          </span>
                          <span>{item.text}</span>
                        </div>
                      </Dropdown.Item>
                    );
                  }
                })
              }
            </div>
          </div>
        </DropdownButton>
      </div>
    </>
  );
};

export default AddMenuDropdown;
