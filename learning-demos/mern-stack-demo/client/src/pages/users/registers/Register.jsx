import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/esm/Container";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import { useContext, useState } from "react";
import {
  mailSending,
  registerUser,
} from "../../../controllers/usersController.js";
import { useNavigate } from "react-router-dom";
import { DangerAlert } from "../../../Components/CustomAlert.jsx";
import { UserContext } from "../../../contexts/UserContext.jsx";
const Register = () => {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setformData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleRegister = async () => {
    try {
      setLoading(true);
      const data = await registerUser(
        formData.name,
        formData.email,
        formData.password,
        formData.confirmPassword
      );
      await mailSending(data.code, data.email);
      setUser({ ...UserContext, email: data.email });
      navigate("/activate");
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  return (
    <Container className="d-flex justify-content-center">
      <Card style={{ width: "500px" }} className="bg-body-tertiary">
        <Card.Body>
          <Card.Title>Create a new account</Card.Title>
          <Card.Body>
            <FloatingLabel label="Name" className="mb-3">
              <Form.Control
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={(e) =>
                  setformData({ ...formData, name: e.target.value })
                }
              />
            </FloatingLabel>
            <FloatingLabel label="Email address" className="mb-3">
              <Form.Control
                type="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) =>
                  setformData({ ...formData, email: e.target.value })
                }
              />
            </FloatingLabel>
            <FloatingLabel label="Password" className="mb-3">
              <Form.Control
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) =>
                  setformData({ ...formData, password: e.target.value })
                }
              />
            </FloatingLabel>
            <FloatingLabel label="Confirm Password">
              <Form.Control
                type="password"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setformData({
                    ...formData,
                    confirmPassword: e.target.value,
                  })
                }
              />
            </FloatingLabel>
          </Card.Body>
          <Button
            variant="primary"
            className="d-flex ms-auto"
            onClick={handleRegister}
            disabled={loading}
          >
            {loading ? "Loading…" : "Register"}
          </Button>
          {error && <DangerAlert error={error} />}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Register;
