import React, { useContext, useEffect, useState } from "react";
import { Button, Col, Container, Row, Card, Form } from "react-bootstrap";
import {
  getUserByOther,
  registerInstructor,
  registerUser,
} from "../../services/usersService";
import userImage from "../../../images/user.png";
import { UserDetailContext } from "../../contexts/UserDetailContext";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import PropTypes from "prop-types";
import AdminNavBar from "../../Components/AdminNavBar";
import Role from "../../../../models/RoleEnum";
import Alert from "../../Components/Alert";
import logo from "../../../images/cookiedu_logo.png";

const InstructorRegister = () => {
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setTimeout(async () => {
      if (success || error) {
        const timer = setTimeout(() => {
          setSuccess("");
          setError("");
        }, 1500);

        // Xóa timeout
        return () => clearTimeout(timer);
      }
    }, 0);
  }, [success, error]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: Role.INSTRUCTOR,
  });
  //Handle Register
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await registerInstructor(
        formData.name,
        formData.email,
        formData.password,
        formData.confirmPassword,
        formData.role
      );
      setSuccess("Register successfully");
    } catch (error) {
      setError(error.message);
    }
  };
  return (
    <Row className="ms-(-6) me-0" style={{ height: "100%" }}>
      <Col md={3}>
        <AdminNavBar />
      </Col>
      <Col md={8}>
        <Container>
          <h1 className="mt-3"> Register Instructor</h1>
          <Container className="d-flex justify-content-center align-items-center mt-5">
            <Container className="p-4 shadow">
              <Row>
                <Col
                  md="6"
                  className="text-center text-md-start d-flex flex-column justify-content-center"
                >
                  <h1 className="my-5 display-3 fw-bold ls-tight text-info-emphasis px-3">
                    Register Page <br />
                    <span className="text-dark-emphasis">for your account</span>
                  </h1>

                  <div style={{ textAlign: "center" }}>
                    <img
                      src={logo}
                      alt="Logo"
                      style={{ maxWidth: "50%", maxHeight: "300px" }}
                    />
                  </div>
                </Col>

                <Col md="6">
                  <Card className="my-5">
                    <Card.Body className="p-5 shadow">
                      <Row>
                        <Col>
                          <Form.Group className="mb-4">
                            <Form.Label>Your name</Form.Label>
                            <Form.Control
                              type="input"
                              className="input p-1"
                              value={formData.name}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  name: e.target.value,
                                })
                              }
                              autoFocus
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      <Row>
                        <Form.Group className="mb-4">
                          <Form.Label>Email</Form.Label>
                          <Form.Control
                            type="email"
                            className="input p-1"
                            value={formData.email}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                email: e.target.value,
                              })
                            }
                            autoFocus
                          />
                        </Form.Group>
                      </Row>

                      <Form.Group className="mb-4">
                        <Form.Label>Password</Form.Label>
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
                        />
                      </Form.Group>

                      <Form.Group className="mb-4">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control
                          type="password"
                          className="input p-1"
                          value={formData.confirmPassword}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              confirmPassword: e.target.value,
                            })
                          }
                        />
                      </Form.Group>

                      <Row className="d-flex justify-content-center ">
                        <Button
                          className="mb-4 col-3"
                          size="md"
                          onClick={handleRegister}
                        >
                          Register
                        </Button>
                      </Row>
                      {success && <Alert msg={success} type="success" />}
                      {error && <Alert msg={error} type="error" />}
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Container>
          </Container>
        </Container>
      </Col>
    </Row>
  );
};

export default InstructorRegister;
