import Alert from "../../Components/Alert";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import React from "react";
import { registerUser } from "../../services/usersService";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  InputGroup,
} from "react-bootstrap";
import logo from "../../../images/cookiedu_logo.png";

const Register = () => {
  const [error, setError] = useState(null);
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  //Handle Register
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await registerUser(
        formData.name,
        formData.email,
        formData.password,
        formData.confirmPassword
      );
      setUser({ email: formData.email });
      navigate("/otp-authentication");
    } catch (error) {
      setError(error.message);
    }
  };
  return (
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
                        setFormData({ ...formData, name: e.target.value })
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
                      setFormData({ ...formData, email: e.target.value })
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
                    setFormData({ ...formData, password: e.target.value })
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

              <div className="text-center">
                <p>
                  Have already an account?{" "}
                  <a href="/login" style={{ textDecoration: "none" }}>
                    Login here
                  </a>
                </p>
              </div>
              {error && <Alert msg={error} type="error" />}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
