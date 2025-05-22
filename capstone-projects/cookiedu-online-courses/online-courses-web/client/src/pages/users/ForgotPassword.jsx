import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  InputGroup,
} from "react-bootstrap";
import mongoose from "mongoose";
import Alert from "../../Components/Alert";
import { useState } from "react";
import React from "react";
import { checkEmailUser } from "../../services/usersService";
import { useNavigate } from "react-router-dom";
import { Modal } from "react-bootstrap";
import { set } from "mongoose";
import logo from "../../../images/cookiedu_logo.png";
import successImg from "../../../images/success.png";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [showDoneSend, setShowDoneSend] = useState(false);
  //error State
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [email, setEmail] = useState("");

  //Handle login
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      await checkEmailUser(email);
      setShowDoneSend(true);
    } catch (err) {
      setError(err.message);
    }
  };

  const confirm = () => {
    setShowDoneSend(false);
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
            Forgot Password Page <br />
            <span className="text-dark-emphasis h3">
              Provide your account's email to reset your password
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

        <Col md="4">
          <Card style={{ marginTop: "40%" }}>
            <Card.Body className="p-5 shadow">
              <Row>
                <h4 className="d-flex justify-content-center text-align center mb-4">
                  Fill in your account's email
                </h4>
              </Row>
              <Row>
                <Col>
                  <Form.Group className="mb-4">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      className="input p-1"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoFocus
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="d-flex justify-content-center mt-4 ">
                <Button
                  className="mb-4 col-6"
                  size="md"
                  onClick={handleForgotPassword}
                >
                  Send Email
                </Button>
              </Row>

              {error && <Alert msg={error} type="error" />}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Modal show={showDoneSend} centered>
        <Modal.Header closeButton>
          <Modal.Title className="text-primary">
            Sent is successfully
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{ textAlign: "center" }}>
            <img
              src={successImg}
              alt="Successfully updated"
              style={{ maxWidth: "30%", maxHeight: "300px" }}
            />
          </div>
          <h5>Please check your email to reset your password</h5>
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

export default ForgotPassword;
