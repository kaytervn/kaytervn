import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/esm/Container";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MyAlert } from "../../Components/CustomAlert";
import { createComment } from "../../services/commentService";
import { UserContext } from "../../contexts/UserContext";
import Role from "../../../../models/RoleEnum";

const CreateComment = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const { state } = useLocation();
  const [alert, setAlert] = useState({
    message: "",
    variant: "",
  });

  const [formLesson] = useState({
    _id: state._id,
    courseId: state.courseId,
    title: state.title,
    description: state.description,
    createdAt: state.createdAt,
  });

  const [formData, setFormData] = useState({
    content: "",
    lessonId: formLesson._id,
  });

  const handleCreate = async () => {
    try {
      setLoading(true);
      await createComment({
        content: formData.content,
        lessonId: formData.lessonId,
      });
      if (user.role == Role.INSTRUCTOR) {
        navigate("/update-lesson-details", { state: formLesson });
      } else if (user.role == Role.STUDENT) {
        navigate("/lesson-details", { state: formLesson });
      }
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
        <Card className="bg-info-subtle">
          <Card.Body>
            <Card.Title className="lead text-center fs-3">
              Create comment
            </Card.Title>
            <Card.Body>
              <FloatingLabel label="Content">
                <Form.Control
                  as="textarea"
                  style={{ height: "225px" }}
                  placeholder="Content"
                  value={formData.content}
                  onChange={(e) => {
                    e.preventDefault();
                    setFormData({
                      ...formData,
                      content: e.target.value,
                    });
                  }}
                />
              </FloatingLabel>
            </Card.Body>
            <Button
              variant="primary"
              className="d-flex ms-auto me-3"
              onClick={handleCreate}
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

export default CreateComment;
