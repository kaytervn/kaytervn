import Alert from "../../Components/Alert";
import { useState } from "react";
import React from "react";
import { resetPasswordUser } from "../../services/usersService";
import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  InputGroup,
} from "react-bootstrap";
import { set } from "mongoose";
import { Modal } from "react-bootstrap";
import logo from "../../../images/cookiedu_logo.png";
import success from "../../../images/success.png";

const ResetPassword = () => {
  const { id, token } = useParams();
  const navigate = useNavigate();

  const [error, setError] = useState(null);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showResetPasswordSuccessfully, setShowResetPasswordSuccessfully] =
    useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      if (!password || !confirmPassword) {
        throw new Error("Please fill all the fields!");
      } else if (password !== confirmPassword) {
        throw new Error("Passwords do not match!");
      } else {
        await resetPasswordUser(id, token, password);
        setShowResetPasswordSuccessfully(true);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const confirm = () => {
    setShowResetPasswordSuccessfully(false);
    navigate("/login");
  };

  return (
    <Container className="p-4 shadow">
      <Row>
        <Col
          md="7"
          className="text-center text-md-start d-flex flex-column justify-content-center"
        >
          <h1 className="my-5 display-3 fw-bold ls-tight text-info-emphasis px-3">
            Reset Password Page <br />
            <span className="text-dark-emphasis h3">
              Fill in a new password for your account
            </span>
          </h1>

          <div style={{ textAlign: "center" }}>
            <img
              src={logo}
              alt="Logo"
              style={{ maxWidth: "50%", maxHeight: "300px" }}
            />
          </div>
        </Col>

        <Col md="5">
          <Card style={{ marginTop: "20%" }}>
            <Card.Body className="p-5 shadow">
              <Row>
                <Col>
                  <Form.Group className="mb-4">
                    <Form.Label>New Password</Form.Label>
                    <Form.Control
                      type="input"
                      className="input p-1"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoFocus
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Form.Group className="mb-4">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    className="input p-1"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </Form.Group>
              </Row>

              <Row className="d-flex justify-content-center mt-4 ">
                <Button
                  className="mb-4 col-4"
                  size="md"
                  onClick={handleResetPassword}
                >
                  Reset Password
                </Button>
              </Row>

              {error && <Alert msg={error} type="error" />}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Modal show={showResetPasswordSuccessfully} centered>
        <Modal.Header closeButton>
          <Modal.Title className="text-primary">
            Reset password is successfully
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{ textAlign: "center" }}>
            <img
              src={success}
              alt="Successfully updated"
              style={{ maxWidth: "30%", maxHeight: "300px" }}
            />
          </div>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-center text-align-center">
          <Button variant="success" onClick={confirm}>
            Continue
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ResetPassword;
