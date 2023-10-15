import React from "react";
import { Alert } from "react-bootstrap";

type ErrorAlertProps = {
  show: boolean;
  setShow: (flag: boolean) => void;
  title?: string;
  message: string;
};

const ErrorAlert = (props: ErrorAlertProps) => {
  const { title = "Error!", message, show, setShow } = props;

  return show ? (
    <Alert variant="danger" onClose={() => setShow(false)} dismissible>
      <Alert.Heading>{title}</Alert.Heading>
      <p>{message}</p>
    </Alert>
  ) : null;
};

export default ErrorAlert;
