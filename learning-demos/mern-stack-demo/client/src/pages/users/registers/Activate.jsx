import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/esm/Container";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import { DangerAlert } from "../../../Components/CustomAlert";
import { activateUser } from "../../../controllers/usersController";
import { useContext, useState } from "react";
import { UserContext } from "../../../contexts/UserContext";
import { useNavigate } from "react-router-dom";

const Activate = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const [error, setError] = useState(null);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    try {
      setLoading(true);
      const data = await activateUser(code, user.email);
      setUser({
        ...UserContext,
        email: data.email,
        token: data.token,
        posts: [],
      });
      navigate("/dashboard");
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  return (
    <Container className="d-flex justify-content-center">
      <Card style={{ width: "500px" }} className="bg-body-tertiary">
        <Card.Body>
          <Card.Title>Activate your account</Card.Title>
          <Card.Body>
            <Card.Text>
              Please check your email to activate your account!
            </Card.Text>
            <FloatingLabel label="OTP Code" className="mb-3">
              <Form.Control
                type="text"
                placeholder="OTP Code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </FloatingLabel>
          </Card.Body>
          <Button
            variant="primary"
            className="d-flex ms-auto"
            onClick={handleVerify}
            disabled={loading}
          >
            {loading ? "Loading…" : "Verify"}
          </Button>
          {error && <DangerAlert error={error} />}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Activate;
