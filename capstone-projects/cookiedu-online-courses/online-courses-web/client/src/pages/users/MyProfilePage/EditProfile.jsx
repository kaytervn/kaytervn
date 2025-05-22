import React, { useState, useContext, useEffect } from "react";
import { Button, Col, Container, Row, Card, Form } from "react-bootstrap"; // Thêm Form từ react-bootstrap
import "./MyProfilePage.css";
import { UserContext } from "../../../contexts/UserContext";
import userImage from "../../../../images/user.png";
import { useNavigate } from "react-router-dom";
import { updateUserProfile } from "../../../services/usersService";
import Alert from "../../../Components/Alert";
import { Modal } from "react-bootstrap";
import success from "../../../../images/success.png";

const EditProfile = () => {
  const { user, setUser } = useContext(UserContext);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();
  const [showChangeInform, setShowChangeModal] = useState(false);
  const [userData, setUserData] = useState({
    name: user.name || "",
    picture: user.picture || "",
    email: user.email || "",
    phone: user.phone || "",
    role: user.role,
  });

  useEffect(() => {
    setUserData({
      name: user.name || "",
      picture: user.picture || "",
      email: user.email || "",
      phone: user.phone || "",
    });
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", userData.name);
      // formData.append('email', userData.email);
      formData.append("phone", userData.phone);
      formData.append("picture", userData.picture);
      console.log(userData.picture);
      await updateUserProfile(formData);
      setUser({
        token: localStorage.getItem("token"),
        email: userData.email,
        name: userData.name,
        role: user.role,
        picture: selectedImage || user.picture,
        phone: userData.phone,
      });
      setShowChangeModal(true);
      // navigate('/my-profile')
    } catch (error) {
      setError(error.message);
    }
  };

  const confirm = () => {
    navigate("/my-profile");
    setShowChangeModal(false);
  };

  const handleCancel = (e) => {
    e.preventDefault();
    navigate("/my-profile");
  };

  return (
    <section className="vh-90" style={{ backgroundColor: "#f4f5f7" }}>
      <Container className="py-5 h-100">
        <Row className="justify-content-center align-items-center h-100">
          <Col lg="6" className="mb-4 mb-lg-0">
            <Card className="mb-3" style={{ borderRadius: ".5rem" }}>
              <Row className="g-0" style={{ height: "450px" }}>
                <Col
                  md="4"
                  className="gradient-custom text-center text-white shadow bg-body-tertiary rounded"
                  style={{
                    borderTopLeftRadius: ".5rem",
                    borderBottomLeftRadius: ".5rem",
                  }}
                >
                  <Card.Img
                    className="rounded-circle my-5"
                    src={
                      selectedImage ||
                      (user.picture === null || user.picture === ""
                        ? userImage
                        : user.picture)
                    }
                    alt="Avatar"
                    style={{ width: "80px", height: "80px " }}
                  />

                  <Card.Title as="h5">{user.name}</Card.Title>
                  <Card.Text as="h6">{user.role}</Card.Text>

                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    id="upload-image"
                    onChange={(e) => {
                      e.preventDefault();
                      setSelectedImage(URL.createObjectURL(e.target.files[0]));
                      setUserData({
                        ...userData,
                        picture: e.target.files[0],
                      });
                    }}
                  />
                  <label htmlFor="upload-image">
                    <Button
                      className="mt-5"
                      variant="outline-light"
                      size="sm"
                      as="span"
                    >
                      Upload
                    </Button>
                  </label>
                </Col>
                <Col md="8">
                  <Card.Body
                    className="p-4 shadow bg-body-tertiary rounded"
                    style={{ backgroundColor: "#f8f9fa" }}
                  >
                    <Card.Title as="h4">Information</Card.Title>
                    <hr className="mt-0 mb-4" />
                    <Row>
                      <Form>
                        <Form.Group className="mb-3" controlId="formName">
                          <Form.Label>Name</Form.Label>
                          <Form.Control
                            type="text"
                            name="name"
                            value={userData.name}
                            onChange={handleInputChange}
                          />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formEmail">
                          <Form.Label>Email</Form.Label>
                          <Form.Control
                            type="email"
                            name="email"
                            value={user.email}
                            disabled:true
                            // readOnly:true
                          />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formPhone">
                          <Form.Label>Phone</Form.Label>
                          <Form.Control
                            type="text"
                            name="phone"
                            value={userData.phone}
                            onChange={handleInputChange}
                          />
                        </Form.Group>
                      </Form>
                    </Row>

                    <Row>
                      <div className="d-flex justify-content-start mt-5">
                        <a href="#!" className="me-3">
                          <i className="fab fa-facebook fa-lg"></i>
                        </a>
                        <a href="#!" className="me-3">
                          <i className="fab fa-twitter fa-lg"></i>
                        </a>
                        <a href="#!" className="me-3">
                          <i className="fab fa-instagram fa-lg"></i>
                        </a>
                      </div>
                    </Row>

                    <Row className="d-flex justify-content-center text-align mt-5">
                      <Col className="d-flex justify-content-center">
                        <Button
                          variant="outline-danger"
                          size="sm"
                          className="mt-1"
                          onClick={handleCancel}
                        >
                          Cancel
                        </Button>
                      </Col>
                      <Col className="d-flex justify-content-center">
                        <Button
                          variant="outline-success"
                          size="sm"
                          className="mt-1"
                          onClick={handleSave}
                        >
                          Save
                        </Button>
                      </Col>
                      {error && <Alert msg={error} type="error" />}
                    </Row>
                  </Card.Body>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
        <Modal show={showChangeInform} centered>
          <Modal.Header closeButton>
            <Modal.Title className="text-primary">
              Update status is successfully
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div style={{ textAlign: "center" }}>
              <img
                src={success}
                alt="Successfully updated"
                style={{ maxWidth: "30%", maxHeight: "300px" }}
              />
            </div>
          </Modal.Body>
          <Modal.Footer className="d-flex justify-content-center text-align-center">
            <Button variant="success" onClick={confirm}>
              Continue
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </section>
  );
};

export default EditProfile;
