import React, { useState, useEffect } from "react";
import "./int.css";
import { Button } from "react-bootstrap";
import _ from "lodash";
import { relative } from "path";

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
}

const Card: React.FC<Props> = (props) => {
  const {
    logo,
    displayName,
    connected,
    handleIntSet,
    id,
    description,
    handleIntDelSet,
    showDisabled,
  } = props;

  let debounce_connect = _.debounce(() => {
    handleIntSet(id, displayName, logo);
  }, 1000);
  const [showSelect, setShowSelect] = useState<any>(false);
  let debounce_disconnect = _.debounce(() => {
    handleIntDelSet(id, displayName);
  }, 1000);
  return id ? (
    <div
      onClick={() => (!connected ? debounce_connect() : "")}
      className={`card pad3 integration-card ${!connected && "card-hover"}`}
      onMouseEnter={() => setShowSelect(true)}
      onMouseLeave={() => setShowSelect(false)}
      style={{
        width: " 17rem",
        margin: "1rem 1rem",
        position: "relative",
        height: "17rem",
        borderRadius: "8px",
        boxShadow: "2px 2px 8px 7px rgba(224,224,224,0.28)",
        paddingBottom: "1rem !important",
      }}
    >
      <div
        style={{
          display: "flex",
          alignContent: "center",
          justifyContent: " flex-end",
        }}
      >
        {!connected ? (
          <a href="" className="btn-connectStyle btn-connectStyle1">
            Connected
          </a>
        ) : (
          <a href="" className="btn-connectStyle btn-connectStyle2">
            Connected
          </a>
        )}
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
        {!connected ? (
          <a
            style={{
              cursor: "pointer",
              padding: "0.5rem",
              fontFamily: "Open Sans",
              fontStyle: " normal",
              fontWeight: "400",
              fontSize: "12px",
              lineHeight: "16px",
            }}
          >
            click to setup
          </a>
        ) : (
          <Button
            onClick={() => debounce_disconnect()}
            variant="outline-danger"
            style={{ cursor: "pointer", padding: " 0.5rem" }}
            disabled={showDisabled}
          >
            Disconnect
          </Button>
        )}
      </div>
    </div>
  ) : (
    <div>Loading...</div>
  );
};

export default Card;
