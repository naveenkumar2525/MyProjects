import React from "react";
import { Alert, Button } from "react-bootstrap";

type SuccessAlertProps = {
  show: boolean;
  setShow: (flag: boolean) => void;
  title?: string;
  message: string;
};

const SuccessAlert = (props: SuccessAlertProps) => {
  const { title = "Success!", message, show, setShow } = props;

  return show ? (
    <Alert show={show} variant="success">
      <Alert.Heading>{title}</Alert.Heading>
      <p>{message}</p>
      <hr />
      <div className="d-flex justify-content-end">
        <Button onClick={() => setShow(false)} variant="outline-success">
          Close
        </Button>
      </div>
    </Alert>
  ) : null;
};

export default SuccessAlert;
