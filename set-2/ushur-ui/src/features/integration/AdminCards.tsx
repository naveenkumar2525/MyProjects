import React, { useState, useEffect } from "react";
import "./int.css";
import { Button } from "react-bootstrap";
import _ from "lodash";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import {
  getSelectiveEnabling,
  postSelectiveEnabling,
} from "./integrationSlice";
import { connect } from "http2";
interface Props {
  logo: string;
  displayName: string;
  connected: boolean;
  handleIntSet: any;
  id: string;
  handlePatch: any;
  description: string;
  handleDelete: any;
  handleIntDelSet: any;
  showDisabled: any;
  setCurrentCheckInt: any;
  currentCheckInt: any;
  integrationAdminList: any;
  checkputSuccessStatus: any;
  setCheckConection: any;
  set500: any;
}

const AdminCard: React.FC<Props> = (props) => {
  const [currentInt, setCurrentInt] = useState<any>({});

  const dispatch = useAppDispatch();
  const {
    logo,
    displayName,
    connected,
    handleIntSet,
    checkputSuccessStatus,
    id,
    description,
    handleIntDelSet,
    showDisabled,
    setCurrentCheckInt,
    currentCheckInt,
    integrationAdminList,
    setCheckConection,
    set500,
  } = props;

  let debounce_toggle = _.debounce((e: any) => {
    dispatch(postSelectiveEnabling({ [id]: e }));
    checkputSuccessStatus();
    setCurrentInt((prevState: any) => {
      return { ...prevState, [displayName]: e };
    });
  }, 1000);

  let debounce_connected_toggle = _.debounce((e: any) => {
    dispatch(postSelectiveEnabling({ [id]: e }));
    setTimeout(checkputSuccessStatus(), 200);
    setTimeout(set500(true), 320);
    return setTimeout(() => {
      setCheckConection("");
      set500(false);
    }, 5000);
  }, 1000);

  const checkStatus = (word: any) => {
    if (integrationAdminList) {
      for (let i = 0; i < integrationAdminList.length; i++) {
        const element: any = integrationAdminList[i];
        if (element[word]) {
          return element[word];
        }
      }
    }
    return false;
  };

  return id ? (
    <div
      className="card pad3 integration-card"
      style={{
        width: " 17rem",
        margin: "1rem 1rem",
        height: "17rem",
        borderRadius: "8px",
        boxShadow: "2px 2px 8px 7px rgba(224,224,224,0.28)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignContent: "center",
          justifyContent: " flex-end",
        }}
      >
        <a
          href=""
          className={
            !connected
              ? "btn-connectStyle btn-connectStyle1"
              : "btn-connectStyle btn-connectStyle2"
          }
        >
          Connected
        </a>
      </div>
      <div className="card-body" style={{ height: "13rem" }}>
        <div
          style={{
            height: "54px",
            textAlign: "center",
            display: "flex",
            alignContent: "center",
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          <img style={{ height: "100%" }} src={logo} />
        </div>
        <h4 className="card-title " style={{ fontSize: "1rem" }}>
          {displayName}
        </h4>
        <p className="card-text " style={{ fontSize: ".8rem" }}>
          {description}
        </p>
      </div>

      <div
        style={{
          display: "flex",
          alignContent: "center",
          justifyContent: " flex-end",
        }}
      >
        {
          <label className="toggle">
            {connected ? (
              <div>
                <input
                  className="toggle__input"
                  name={displayName}
                  type="checkbox"
                  id="myToggle"
                  checked={true}
                  defaultChecked={true}
                  onClick={(e: any) =>
                    debounce_connected_toggle(e.target.checked)
                  }
                />

                <div
                  className={`toggle__fill    ${"enabled"}`}
                  style={{ marginRight: "1rem" }}
                >
                  {" "}
                  {"enabled"}
                </div>
              </div>
            ) : (
              <div>
                <input
                  className="toggle__input"
                  name={displayName}
                  type="checkbox"
                  id="myToggle"
                  onChange={(e: any) =>
                    setCurrentCheckInt((prevState: any) => {
                      return { ...prevState, [displayName]: e.target.checked };
                    })
                  }
                  defaultChecked={connected ? true : checkStatus(id)}
                  onClick={(e: any) => debounce_toggle(e.target.checked)}
                />

                <div
                  className={`toggle__fill    ${
                    currentCheckInt[displayName] === undefined
                      ? checkStatus(id)
                        ? "enabled"
                        : "disabled"
                      : currentCheckInt[displayName]
                      ? "enabled"
                      : "disabled"
                  }`}
                  style={{ marginRight: "1rem" }}
                >
                  {" "}
                  {currentCheckInt[displayName] === undefined
                    ? checkStatus(id)
                      ? "enabled"
                      : "disabled"
                    : currentCheckInt[displayName]
                    ? "enabled"
                    : "disabled"}
                </div>
              </div>
            )}
          </label>
        }
      </div>
    </div>
  ) : (
    <div>Loading...</div>
  );
};

export default AdminCard;
