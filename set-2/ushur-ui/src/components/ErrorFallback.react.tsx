/* istanbul ignore file */
import { Button } from "@ushurengg/uicomponents";
import { Modal } from "react-bootstrap";
import { useState } from "react";

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

function ErrorFallback(props: ErrorFallbackProps) {
  const { error, resetErrorBoundary } = props;

  const [show, setShow] = useState(true);
  const handleResetAndClose = () => {
    resetErrorBoundary();
    setShow(false);
  };

  return (
    <>
      <Modal show={show} onHide={handleResetAndClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Something went wrong</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <pre>{error.message}</pre>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleResetAndClose}>
            Please try again
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ErrorFallback;
