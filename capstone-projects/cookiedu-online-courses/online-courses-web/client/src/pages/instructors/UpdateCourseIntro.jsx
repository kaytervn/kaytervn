import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/esm/Container";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import Image from "react-bootstrap/Image";
import InputGroup from "react-bootstrap/InputGroup";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Topic from "../../../../models/TopicEnum";
import blankImg from "../../../images/blank.png";
import { MyAlert } from "../../Components/CustomAlert";
import { updateCourseIntro } from "../../services/coursesService";

const UpdateCourseIntro = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    _id: state._id,
    userId: state.userId,
    picture: state.picture,
    pictureFile: null,
    title: state.title,
    price: state.price,
    description: state.description,
    instructorName: state.instructorName,
    topic: state.topic,
  });
  const [alert, setAlert] = useState({
    message: "",
    variant: "",
  });

  const handleUpdateCourseIntro = async () => {
    try {
      setLoading(true);
      const sendFormData = new FormData();
      sendFormData.append("picture", formData.pictureFile);
      sendFormData.append("title", formData.title);
      sendFormData.append("price", formData.price);
      sendFormData.append("description", formData.description);
      sendFormData.append("topic", formData.topic);
      await updateCourseIntro({ _id: formData._id, formData: sendFormData });
      navigate("/edit-course", { state: formData });
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
              Update course intro
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
                    <InputGroup.Text className="bi bi-tag-fill px-3 bg-primary text-light" />
                    <select
                      className="form-select"
                      value={formData.topic}
                      style={{ height: "60px" }}
                      onChange={(e) => {
                        e.preventDefault();
                        setFormData({ ...formData, topic: e.target.value });
                      }}
                    >
                      <option value={Topic.WEB}>Web Development</option>
                      <option value={Topic.AI}>Artificial Intelligence</option>
                      <option value={Topic.DATA}>Data Science</option>
                      <option value={Topic.MOBILE}>Mobile Development</option>
                      <option value={Topic.GAME}>Game Development</option>
                      <option value={Topic.SOFTWARE}>
                        Software Engineering
                      </option>
                    </select>
                  </InputGroup>
                  <InputGroup className="mb-3">
                    <InputGroup.Text className="bi bi-wallet2 px-3 bg-primary text-light" />
                    <FloatingLabel label="Price">
                      <Form.Control
                        type="text"
                        placeholder="Price"
                        value={formData.price}
                        onChange={(e) => {
                          e.preventDefault();
                          const inputPrice = e.target.value;
                          if (/^\d*\.?\d*$/.test(inputPrice)) {
                            setFormData({ ...formData, price: inputPrice });
                          }
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
                      accept=".jpg, .jpeg, .png, .bmp, .tiff, .tif, .webp, .svg, .svgz"
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          pictureFile: e.target.files[0],
                          picture: URL.createObjectURL(e.target.files[0]),
                        });
                      }}
                    />
                  </InputGroup>
                  <Image
                    thumbnail
                    src={formData.picture ? formData.picture : blankImg}
                    className="object-fit-contain mb-3"
                    style={{ height: "400px" }}
                  ></Image>
                </div>
              </div>
            </Card.Body>
            <Button
              variant="primary"
              className="d-flex ms-auto me-3"
              onClick={handleUpdateCourseIntro}
              disabled={loading}
            >
              {loading ? "Updating..." : "Update"}
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

export default UpdateCourseIntro;
