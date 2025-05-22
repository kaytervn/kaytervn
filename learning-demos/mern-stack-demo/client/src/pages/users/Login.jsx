import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/esm/Container";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import { useContext, useState } from "react";
import { loginUser } from "../../controllers/usersController.js";
import { DangerAlert } from "../../Components/CustomAlert.jsx";
import { UserContext } from "../../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

const Login = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [formData, setformData] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async () => {
    try {
      const data = await loginUser(formData.email, formData.password);
      setUser({ email: data.email, token: data.token, posts: [] });
      navigate("/dashboard");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Container className="d-flex justify-content-center">
      <Card style={{ width: "500px" }} className="bg-body-tertiary">
        <Card.Body>
          <Card.Title>Login to your account</Card.Title>
          <Card.Body>
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
            <FloatingLabel label="Password">
              <Form.Control
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) =>
                  setformData({ ...formData, password: e.target.value })
                }
              />
            </FloatingLabel>
          </Card.Body>
          <Button
            variant="primary"
            className="d-flex ms-auto"
            onClick={handleLogin}
          >
            Login
          </Button>
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              console.log(credentialResponse);
            }}
            onError={() => {
              console.log("Login Failed");
            }}
            useOneTap
          />
          {error && <DangerAlert error={error} />}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Login;
