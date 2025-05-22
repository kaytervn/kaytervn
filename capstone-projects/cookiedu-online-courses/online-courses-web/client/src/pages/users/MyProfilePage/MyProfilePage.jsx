import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Col, Container, Row, Card } from "react-bootstrap";
import "./MyProfilePage.css";
import { UserContext } from "../../../contexts/UserContext";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import userImage from "../../../../images/user.png";

const MyProfilePage = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleEditProfile = () => {
    navigate("/my-profile/edit");
  };

  const handleChangePassword = () => {
    navigate("/my-profile/change-password");
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
                  className="gradient-custom text-center text-white"
                  style={{
                    borderTopLeftRadius: ".5rem",
                    borderBottomLeftRadius: ".5rem",
                  }}
                >
                  <Card.Img
                    className="rounded-circle my-5"
                    src={
                      user.picture === null || user.picture === ""
                        ? userImage
                        : user.picture
                    }
                    alt="Avatar"
                    style={{ width: "80px", height: "80px" }}
                  />

                  <Card.Title as="h5">{user.name}</Card.Title>
                  <Card.Text as="h6">{user.role}</Card.Text>

                  <Button
                    className="mt-5"
                    variant="outline-light"
                    size="sm"
                    as="span"
                    onClick={handleEditProfile}
                  >
                    Edit Profile
                  </Button>
                </Col>
                <Col md="8">
                  <Card.Body
                    className="p-4 shadow bg-body-tertiary rounded"
                    style={{ backgroundColor: "#f8f9fa" }}
                  >
                    <Card.Title as="h4">Information</Card.Title>
                    <hr className="mt-0 mb-4" />
                    <Row className="pt-1">
                      <Col size="6" className="mb-3">
                        <Card.Title as="h6">Email</Card.Title>
                        <Card.Text className="text-muted">
                          {user.email}
                        </Card.Text>
                      </Col>
                      <Col size="6" className="mb-3">
                        <Card.Title as="h6">Phone</Card.Title>
                        <Card.Text className="text-muted">
                          {user.phone}
                        </Card.Text>
                      </Col>
                    </Row>

                    <Card.Title as="h5" style={{ marginTop: "10%" }}>
                      Contact via
                    </Card.Title>
                    <hr className="mt-0 mb-4" />
                    <Row className="pt-1">
                      <Col size="6" className="mb-3">
                        <Card.Title as="h6">Email</Card.Title>
                        <Card.Text className="text-muted">
                          {user.email}
                        </Card.Text>
                      </Col>
                      <Col size="6" className="mb-3">
                        <Card.Title as="h6">Phone</Card.Title>
                        <Card.Text className="text-muted">
                          {user.phone}
                        </Card.Text>
                      </Col>
                    </Row>
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

                    <div className="text-center mt-5">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        as="span"
                        onClick={handleChangePassword}
                      >
                        Change Password
                      </Button>
                    </div>
                  </Card.Body>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default MyProfilePage;
