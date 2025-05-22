import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  Col,
  Container,
  Row,
  Card,
  Image,
  Modal,
  ToastContainer,
  Toast,
} from "react-bootstrap";
import { getUserByOther } from "../../services/usersService";
import userImage from "../../../images/user.png";
import { UserDetailContext } from "../../contexts/UserDetailContext";
import { useLocation, useParams } from "react-router-dom";
import AdminNavBar from "../../Components/AdminNavBar";
import Role from "../../../../models/RoleEnum";
import {
  changeCourseStatus,
  changeCourseVisibility,
  getCoursesByInstructorId,
  getCoursesByStudentId,
} from "../../services/coursesService";
import userImg from "../../../images/user.png";
import DataTable from "react-data-table-component";
import { customStyles } from "../../Components/customStyles/datatableCustom";
import { CoursesByUserContext } from "../../contexts/CoursesByUserContext";

const UserDetail = () => {
  const { courses, setCourses } = useContext(CoursesByUserContext);
  const { user, setUser } = useContext(UserDetailContext);
  const { state } = useLocation();
  const [userId] = useState({
    userId: state.userId,
  });

  const [showPopup, setShowPopup] = useState(false);
  const [courseId, setCourseId] = useState(null);
  const [visibilityOrStatus, setVisibilityOrStatus] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");

  useEffect(() => {
    setTimeout(async () => {
      const user = await getUserByOther(userId.userId);

      setUser(user);

      if (user.role == Role.INSTRUCTOR) {
        const listCoursesByInstructor = await getCoursesByInstructorId(
          userId.userId
        );
        setCourses({
          listCoursesByInstructor: listCoursesByInstructor.courses,
          totalRevenuePersonal: listCoursesByInstructor.totalRevenuePersonal,
        });
      } else {
        const listCoursesByStudent = await getCoursesByStudentId(userId.userId);
        setCourses({
          listCoursesByStudent: listCoursesByStudent.courses,
          totalPurchased: listCoursesByStudent.totalPurchased,
        });
      }
    }, 0);
  }, []);

  const cancelPopupStatus = () => {
    setShowPopup(false);
  };

  const confirmChangeVisibilityOrStatus = async (e) => {
    e.preventDefault();
    // Xử lý confirm change visibility or status
    try {
      var message;
      if (visibilityOrStatus) {
        message = await changeCourseStatus(courseId);
      } else {
        message = await changeCourseVisibility(courseId);
      }

      if (user.role == Role.INSTRUCTOR) {
        const listCoursesByInstructor = await getCoursesByInstructorId(
          userId.userId
        );
        setCourses({
          listCoursesByInstructor: listCoursesByInstructor.courses,
          totalRevenuePersonal: listCoursesByInstructor.totalRevenuePersonal,
        });
      } else {
        const listCoursesByStudent = await getCoursesByStudentId(userId.userId);
        setCourses({
          listCoursesByStudent: listCoursesByStudent.courses,
          totalPurchased: listCoursesByStudent.totalPurchased,
        });
      }
      setShowPopup(false);
      setToastMessage(message.success);
      setToastType("success");
      if (showToast) setShowToast(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3004);
    } catch (err) {
      setToastMessage(err.toString());
      setToastType("danger");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3004);
    }
  };

  const handleShowPopup = (e, id) => {
    e.preventDefault();
    setCourseId(id);
    setShowPopup(true);
  };

  const columns = [
    {
      name: "Title",
      selector: (row) => row.title,
      sortable: true,
    },
    {
      name: "Picture",
      selector: (row) => (
        <div className="text-center">
          {row.picture == "" || row.picture == "false" ? (
            <Image roundedCircle width={"40"} height={"40"} src={userImg} />
          ) : (
            <Image roundedCircle width={"40"} height={"40"} src={row.picture} />
          )}
        </div>
      ),
      sortable: true,
    },

    {
      name: "Price",
      selector: (row) => row.price,
      sortable: true,
    },
    {
      name: "Visibility",
      selector: (row) => (
        <div>
          {row.visibility ? (
            <button
              className="btn btn-success"
              onClick={(e) => {
                handleShowPopup(e, row._id), setVisibilityOrStatus(false);
              }}
            >
              Enable
            </button>
          ) : (
            <button
              className="btn btn-danger"
              onClick={(e) => {
                handleShowPopup(e, row._id), setVisibilityOrStatus(false);
              }}
            >
              Disable
            </button>
          )}
        </div>
      ),
    },
    {
      name: "Status",
      selector: (row) => (
        <div>
          {row.status ? (
            <button
              className="btn btn-success"
              onClick={(e) => {
                handleShowPopup(e, row._id), setVisibilityOrStatus(true);
              }}
            >
              Enable
            </button>
          ) : (
            <button
              className="btn btn-danger"
              onClick={(e) => {
                handleShowPopup(e, row._id), setVisibilityOrStatus(true);
              }}
            >
              Disable
            </button>
          )}
        </div>
      ),
    },
  ];

  // async function handleSearch(e) {
  //   e.preventDefault();
  //   const newCourses = (await getCourseByInstructorId(userId.userId)).filter(
  //     (course) =>
  //       course.title.toLowerCase().includes(e.target.value.toLowerCase()) ||
  //       course.description.toLowerCase().includes(e.target.value.toLowerCase())
  //   );
  //   setCourses({ listCourses: newCourses });
  // }

  const renderToast = () => {
    if (!showToast) return null;
    return (
      <ToastContainer
        className="p-3"
        position="top-end"
        style={{ position: "fixed", top: 0, right: 0, zIndex: 1050 }}
      >
        <Toast
          onClose={() => setShowToast(false)}
          bg={toastType}
          delay={10000}
          autohide
        >
          <Toast.Header>
            <strong className="me-auto">Thông Báo</strong>
            <small>Just now</small>
          </Toast.Header>
          <Toast.Body style={{ color: "white" }}>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    );
  };

  return (
    <Row className="ms-(-6) me-0">
      <Col md={3}>
        <AdminNavBar
          style={{
            position: "fixed",
            height: "100%",
            overflow: "auto",
          }}
        />
      </Col>
      <Col md={8}>
        {renderToast()}
        <Modal show={showPopup} onHide={cancelPopupStatus} centered>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Change</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {visibilityOrStatus ? (
              <div>Are you sure you want to change status this student?</div>
            ) : (
              <div>
                Are you sure you want to change visibility this student?
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={cancelPopupStatus}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={(e) => {
                confirmChangeVisibilityOrStatus(e, courseId);
              }}
            >
              Confirm
            </Button>
          </Modal.Footer>
        </Modal>
        <Container>
          <h1 className="mt-3"> User Detail</h1>
          <section className="" style={{ backgroundColor: "#ffffff" }}>
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
                            user.picture === null ||
                            (user.picture === "") | (user.picture === "false")
                              ? userImage
                              : user.picture
                          }
                          alt="Avatar"
                          style={{ width: "80px" }}
                        />

                        <Card.Title as="h5">{user.name}</Card.Title>
                        <Card.Text as="h6">{user.role}</Card.Text>
                      </Col>
                      <Col md="8">
                        <Card.Body className="p-4">
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
                              <Card.Title as="h6">Description</Card.Title>
                              <Card.Text className="text-muted">
                                {user.description}
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
                        </Card.Body>
                      </Col>
                    </Row>
                  </Card>
                </Col>
              </Row>
            </Container>
          </section>

          {user.role == Role.INSTRUCTOR ? (
            <div className="mb-5">
              <h1 className="mt-3 mb-3"> Course of Instructor</h1>

              <div className="text-end mb-3 mt-3">
                <div className="input-group news-input">
                  <span className="input-group-text">
                    <i className="fa fa-search" aria-hidden="true"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    id="searchInput"
                    placeholder="Search..."
                    // onChange={handleSearch}
                  />
                </div>
              </div>
              <DataTable
                columns={columns}
                data={courses.listCoursesByInstructor}
                fixedHeader
                pagination
                customStyles={customStyles}
              ></DataTable>
              <h2 className="text-end mt-3">
                Total Revenue: {courses.totalRevenuePersonal}💲
              </h2>
            </div>
          ) : user.role == Role.STUDENT ? (
            <div className="mb-5">
              <h1 className="mt-3 mb-3"> Course of Student</h1>

              <div className="text-end mb-3 mt-3">
                <div className="input-group news-input">
                  <span className="input-group-text">
                    <i className="fa fa-search" aria-hidden="true"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    id="searchInput"
                    placeholder="Search..."
                    // onChange={handleSearch}
                  />
                </div>
              </div>
              <DataTable
                columns={columns}
                data={courses.listCoursesByStudent}
                fixedHeader
                pagination
                customStyles={customStyles}
              ></DataTable>
              <h2 className="text-end mt-3">
                Total Purchased: {courses.totalPurchased}💲
              </h2>
            </div>
          ) : null}
        </Container>
      </Col>
    </Row>
  );
};

export default UserDetail;
