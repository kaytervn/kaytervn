import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/esm/Container";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MyAlert } from "../../Components/CustomAlert";
import { createDocument } from "../../services/documentService";

const CreateDocument = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { state } = useLocation();
  const [alert, setAlert] = useState({
    message: "",
    variant: "",
  });

  const [formLesson, setFormLesson] = useState({
    _id: state._id,
    courseId: state.courseId,
    title: state.title,
    description: state.description,
    createdAt: state.createdAt,
  });

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    lessonId: formLesson._id,
    content: null,
    videoURL: "",
  });

  const handleCreate = async () => {
    try {
      setLoading(true);
      const sendFormData = new FormData();
      sendFormData.append("content", formData.content);
      sendFormData.append("title", formData.title);
      sendFormData.append("description", formData.description);
      sendFormData.append("lessonId", formData.lessonId);
      await createDocument(sendFormData);
      navigate("/update-lesson-details", { state: formLesson });
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
              Create document
            </Card.Title>
            <Card.Body>
              <div className="row">
                <div className="col-8">
                  <InputGroup className="mb-3">
                    <InputGroup.Text className="bi bi-textarea-t px-3 bg-primary text-light" />
                    <FloatingLabel label="Title">
                      <Form.Control
                        type="text"
                        placeholder="Title"
                        value={formData.title}
                        onChange={(e) => {
                          e.preventDefault();
                          setFormData({ ...formData, title: e.target.value });
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
                        value={formData.description}
                        onChange={(e) => {
                          e.preventDefault();
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          });
                        }}
                      />
                    </FloatingLabel>
                  </InputGroup>
                </div>
                <div className="col-4">
                  <InputGroup className="mb-3">
                    <InputGroup.Text className="bi bi-image bg-primary text-light" />
                    <Form.Control
                      type="file"
                      accept="video/*"
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          content: e.target.files[0],
                          videoURL: URL.createObjectURL(e.target.files[0]),
                        });
                      }}
                    />
                  </InputGroup>
                  <video
                    src={formData.videoURL}
                    controls
                    className="object-fit-contain w-100"
                    preload="metadata"
                  />
                </div>
              </div>
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

export default CreateDocument;
