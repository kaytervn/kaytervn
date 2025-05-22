import { useState } from "react";
import Alert from "react-bootstrap/Alert";

const MyAlert = ({ msg, variant }) => {
  const [show, setShow] = useState(true);
  setTimeout(() => setShow(false), 2000);

  return (
    <>
      {show && (
        <Alert variant={variant} className="mt-3">
          <i className="bi bi-check-circle-fill pe-2"></i>
          {msg}
        </Alert>
      )}
    </>
  );
};

export { MyAlert };
