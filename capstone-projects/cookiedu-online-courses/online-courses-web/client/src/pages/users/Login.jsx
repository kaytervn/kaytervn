import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  InputGroup,
} from "react-bootstrap";
import Alert from "../../Components/Alert";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import React from "react";
import { CDBBtn, CDBIcon } from "cdbreact";
import {
  getUser,
  loginUser,
  loginUserSocial,
} from "../../services/usersService";
import { Link } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import Role from "../../../../models/RoleEnum";
import logo from "../../../images/cookiedu_logo.png";

const Login = () => {
  const { setUser } = useContext(UserContext);

  //error State
  const [error, setError] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [user, setUser] = useState(null);
  const navigate = useNavigate();

  //Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUser(email, password);
      const token = data.token;
      const dataUser = await getUser(token);
      setUser({
        // id: dataUser._id,
        token,
        email: dataUser.email,
        name: dataUser.name,
        picture: dataUser.picture,
        role: dataUser.role,
      });

      if (dataUser.user.role === Role.ADMIN) {
        navigate("/admin");
      } else if (dataUser.user === Role.INSTRUCTOR) {
        navigate("/instructor");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleLogin = async (e) => {
    window.open("http://online-courses-web.onrender.com/auth/google", "_self");
    e.preventDefault();
    try {
      const data = await loginUserSocial();
      const token = data.token;
      const dataUser = await getUser(token);
      setUser({
        token,
        email: dataUser.user.email,
        name: dataUser.user.name,
        picture: dataUser.user.picture,
        role: dataUser.user.role,
      });

      if (dataUser.user.role === Role.ADMIN) {
        navigate("/admin");
      } else if (dataUser.user === Role.INSTRUCTOR) {
        navigate("/instructor");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleFacebookLogin = async (e) => {
    window.open(`http://online-courses-web.onrender.com/auth/facebook`, "_self");

    e.preventDefault();
    try {
      const data = await loginUserSocial();
      const token = data.token;
      const dataUser = await getUser(token);
      setUser({
        token,
        email: dataUser.user.email,
        name: dataUser.user.name,
        picture: dataUser.user.picture,
        role: dataUser.user.role,
      });

      if (dataUser.user.role === Role.ADMIN) {
        navigate("/admin");
      } else if (dataUser.user === Role.INSTRUCTOR) {
        navigate("/instructor");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGithubLogin = async (e) => {
    window.open(`http://online-courses-web.onrender.com/auth/github`, "_self");
    e.preventDefault();
    try {
      const data = await loginUserSocial();
      const token = data.token;
      const dataUser = await getUser(token);
      setUser({
        token,
        email: dataUser.user.email,
        name: dataUser.user.name,
        picture: dataUser.user.picture,
        role: dataUser.user.role,
      });

      if (dataUser.user.role === Role.ADMIN) {
        navigate("/admin");
      } else if (dataUser.user === Role.INSTRUCTOR) {
        navigate("/instructor");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.message);
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
            Login Page <br />
            <span className="text-dark-emphasis">
              for accessing the{" "}
              <span className="text-warning fw-bold">CookiEdu</span> website
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

        <Col md="6">
          <Card className="my-5">
            <Card.Body className="p-5 shadow">
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

              <Row>
                <Form.Group className="mb-4">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    className="input p-1"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Form.Group>
              </Row>

              <Row className="d-flex justify-content-center mt-4 ">
                <Button className="mb-4 col-3" size="md" onClick={handleLogin}>
                  Login
                </Button>
              </Row>

              <div className="text-center">
                <a
                  href="/forgot-password"
                  style={{ textDecoration: "none", fontStyle: "italic" }}
                >
                  Forgot password?
                </a>
              </div>
              <div className="other-login mt-5 border-top border-info-subtle">
                <p className="text-center mt-2"> or sign up with</p>
                <div className="flex-row mb-3 d-flex justify-content-center">
                  <CDBBtn
                    color="white"
                    className="m-0 fs-5"
                    style={{ boxShadow: "none" }}
                    onClick={handleFacebookLogin}
                  >
                    <CDBIcon fab icon="facebook-f" />
                  </CDBBtn>
                  <CDBBtn
                    color="white"
                    className="m-0 fs-5"
                    style={{ boxShadow: "none" }}
                    onClick={handleGithubLogin}
                  >
                    <CDBIcon fab icon="github" />
                  </CDBBtn>
                  <CDBBtn
                    color="white"
                    className="m-0 fs-5"
                    style={{ boxShadow: "none" }}
                    onClick={handleGoogleLogin}
                  >
                    <CDBIcon fab icon="google-plus-g" />
                  </CDBBtn>
                </div>
              </div>

              {error && <Alert msg={error} type="error" />}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
