import { useState } from "react";
import Alert from "react-bootstrap/Alert";

const DangerAlert = ({ error }) => {
  return (
    <Alert variant="danger" className="mt-3">
      <i className="bi bi-exclamation-triangle-fill pe-2"></i>
      {error}
    </Alert>
  );
};

const InfoAlert = ({ msg }) => {
  return (
    <Alert variant="info" className="mt-3">
      <i className="bi bi-info-circle-fill pe-2"></i>
      {msg}
    </Alert>
  );
};

const SuccessAlert = ({ msg }) => {
  const [show, setShow] = useState(true);
  setTimeout(() => setShow(false), 2000);

  return (
    <>
      {show && (
        <Alert variant="success" className="mt-3">
          <i className="bi bi-check-circle-fill pe-2"></i>
          {msg}
        </Alert>
      )}
    </>
  );
};

export { DangerAlert, InfoAlert, SuccessAlert };
