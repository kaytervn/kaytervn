import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/esm/Container";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MyAlert } from "../../Components/CustomAlert";
import { createLesson } from "../../services/lessonsService";

const CreateLesson = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { state } = useLocation();
  const [alert, setAlert] = useState({
    message: "",
    variant: "",
  });
  const [formData] = useState({
    _id: state._id,
    userId: state.userId,
    picture: state.picture,
    title: state.title,
    price: state.price,
    description: state.description,
    topic: state.topic,
    instructorName: state.instructorName,
    averageStars: state.averageStars,
  });

  const [formLesson, setFormLesson] = useState({
    title: "",
    description: "",
  });

  const handleCreateLesson = async () => {
    try {
      setLoading(true);
      await createLesson({
        courseId: formData._id,
        title: formLesson.title,
        description: formLesson.description,
      });
      navigate("/update-course-details", { state: formData });
    } catch (error) {
      setAlert({ ...alert, message: error.message, variant: "danger" });
      setTimeout(() => {
        setAlert({ ...alert, message: "", variant: "" });
      }, 2000);
    }
    setLoading(false);
  };

  return (
    <>
      <Container className="mt-5">
        <Card className="bg-warning-subtle">
          <Card.Body>
            <Card.Title className="lead text-center fs-3">
              Create lesson
            </Card.Title>
            <Card.Body>
              <InputGroup className="mb-3">
                <InputGroup.Text className="bi bi-textarea-t px-3 bg-primary text-light" />
                <FloatingLabel label="Title">
                  <Form.Control
                    type="text"
                    placeholder="Title"
                    value={formLesson.title}
                    onChange={(e) => {
                      e.preventDefault();
                      setFormLesson({ ...formLesson, title: e.target.value });
                    }}
                  />
                </FloatingLabel>
              </InputGroup>
              <InputGroup className="mb-3">
                <InputGroup.Text className="bi bi-file-text-fill px-3 bg-primary text-light" />
                <FloatingLabel label="Description">
                  <Form.Control
                    as="textarea"
                    style={{ height: "225px" }}
                    placeholder="Description"
                    value={formLesson.description}
                    onChange={(e) => {
                      e.preventDefault();
                      setFormLesson({
                        ...formLesson,
                        description: e.target.value,
                      });
                    }}
                  />
                </FloatingLabel>
              </InputGroup>
            </Card.Body>
            <Button
              variant="primary"
              className="d-flex ms-auto me-3"
              onClick={handleCreateLesson}
              disabled={loading}
            >
              {loading ? "Creating…" : "Create"}
            </Button>
            {alert.message != "" && (
              <MyAlert msg={alert.message} variant={alert.variant} />
            )}
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};

export default CreateLesson;
