import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/esm/Container";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MyAlert } from "../../Components/CustomAlert";
import { updateLesson } from "../../services/lessonsService";
import { getCourse } from "../../services/coursesService";

const UpdateLesson = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { state } = useLocation();
  const [alert, setAlert] = useState({
    message: "",
    variant: "",
  });
  const [formData, setFormData] = useState({
    _id: "",
    userId: "",
    picture: "",
    title: "",
    price: "",
    description: "",
    topic: "",
    instructorName: "",
    averageStars: "",
  });

  const [formLesson, setFormLesson] = useState({
    _id: state._id,
    courseId: state.courseId,
    title: state.title,
    description: state.description,
  });

  const handleUpdateLesson = async () => {
    try {
      setLoading(true);
      await updateLesson({
        _id: formLesson._id,
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

  useEffect(() => {
    setTimeout(async () => {
      try {
        const { course, averageStars } = await getCourse(state.courseId);
        setFormData({
          ...formData,
          _id: course._id,
          userId: course.userId,
          picture: course.picture,
          title: course.title,
          price: course.price,
          description: course.description,
          topic: course.topic,
          instructorName: course.instructorName,
          averageStars: averageStars,
        });
      } catch (error) {
        console.log(error.message);
      }
    }, 0);
  }, []);

  return (
    <>
      <Container className="mt-5">
        <Card className="bg-warning-subtle">
          <Card.Body>
            <Card.Title className="lead text-center fs-3">
              Update lesson
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
              onClick={handleUpdateLesson}
              disabled={loading}
            >
              {loading ? "Updating…" : "Update"}
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

export default UpdateLesson;
