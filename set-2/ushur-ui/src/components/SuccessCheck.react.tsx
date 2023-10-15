import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-regular-svg-icons";
type SuccessCheckProps = {
  title: string;
};

const SuccessCheck = (props: SuccessCheckProps) => {
  const { title } = props;

  return (
    <div
      style={{
        display: "grid",
        placeItems: "center",
        fontSize: 40,
        color: "green",
      }}
    >
      <FontAwesomeIcon icon={faCheckCircle} color="green" size={"lg"} />
      <div>{title}</div>
    </div>
  );
};

export default SuccessCheck;
