import React, { useState, useContext, useEffect } from "react";
import { Button, Col, Container, Row, Card, Form } from "react-bootstrap"; // Thêm Form từ react-bootstrap
import "./MyProfilePage.css";
import { UserContext } from "../../../contexts/UserContext";
import userImage from "../../../../images/user.png";
import { useNavigate } from "react-router-dom";
import {
  changePassword,
  updateUserProfile,
} from "../../../services/usersService";
import Alert from "../../../Components/Alert";
import { Modal } from "react-bootstrap";
import success from "../../../../images/success.png";

const ChangePassword = () => {
  const { user, setUser } = useContext(UserContext);
  const [error, setError] = useState(null);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: "",
    new_password: "",
    confirm_password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await changePassword(
        formData.password,
        formData.new_password,
        formData.confirm_password
      );
      setShowChangePassword(true);
    } catch (error) {
      setError(error.message);
    }
  };

  const confirm = () => {
    navigate("/my-profile");
    setShowChangePassword(false);
  };

  const handleCancel = (e) => {
    e.preventDefault();
    navigate("/my-profile");
  };

  return (
    <section className="vh-90" style={{ backgroundColor: "#f4f5f7" }}>
      <Container className="py-5 h-100">
        <Row className="justify-content-center align-items-center h-100">
          <Col lg="6" className="mb-4 mb-lg-0">
            <Card className="mb-3" style={{ borderRadius: ".5rem" }}>
              <Row
                className="g-0 align-items-stretch"
                style={{ height: "450px" }}
              >
                <Col
                  md="4"
                  className="gradient-custom text-center text-white shadow bg-body-tertiary rounded"
                  style={{
                    borderTopLeftRadius: ".5rem",
                    borderBottomLeftRadius: ".5rem",
                  }}
                >
                  <Card.Img
                    className="rounded-circle my-5"
                    src={
                      user.picture === null || user.picture === ""
                        ? userImage
                        : user.picture
                    }
                    alt="Avatar"
                    style={{ width: "80px" }}
                  />

                  <Card.Title as="h5">{user.name}</Card.Title>
                  <Card.Text as="h6">{user.role}</Card.Text>
                </Col>
                <Col md="8" className="d-flex align-items-center">
                  <Card.Body className="p-4 shadow bg-body-tertiary rounded">
                    <Card.Title as="h4">Change Password</Card.Title>
                    <hr className="mt-0 mb-4" />
                    <Row>
                      <Form>
                        <Form.Group className="mb-3">
                          <Form.Label>Current Password</Form.Label>
                          <Form.Control
                            type="password"
                            className="input p-1"
                            value={formData.password}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                password: e.target.value,
                              })
                            }
                            autoFocus
                          />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>New Password</Form.Label>
                          <Form.Control
                            type="password"
                            className="input p-1"
                            value={formData.new_password}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                new_password: e.target.value,
                              })
                            }
                            autoFocus
                          />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>Confirm Password</Form.Label>
                          <Form.Control
                            type="password"
                            className="input p-1"
                            value={formData.confirm_password}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                confirm_password: e.target.value,
                              })
                            }
                            autoFocus
                          />
                        </Form.Group>
                      </Form>
                    </Row>

                    <Row className="d-flex justify-content-center text-align mt-5">
                      <Col className="d-flex justify-content-center">
                        <Button
                          variant="outline-danger"
                          size="sm"
                          className="mt-1"
                          onClick={handleCancel}
                        >
                          Cancel
                        </Button>
                      </Col>
                      <Col className="d-flex justify-content-center">
                        <Button
                          variant="outline-success"
                          size="sm"
                          className="mt-1"
                          onClick={handleSave}
                        >
                          Save
                        </Button>
                      </Col>
                      {error && <Alert msg={error} type="error" />}
                    </Row>
                  </Card.Body>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
        <Modal show={showChangePassword} centered>
          <Modal.Header closeButton>
            <Modal.Title className="text-primary">
              Change password is successfully
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div style={{ textAlign: "center" }}>
              <img
                src={success}
                alt="Successfully change password"
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
    </section>
  );
};

export default ChangePassword;
