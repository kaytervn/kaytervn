import { useContext, useEffect, useState } from "react";
import Alert from "../../Components/Alert";

import DataTable from "react-data-table-component";
import FormCheckInput from "react-bootstrap/FormCheckInput";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import AdminNavBar from "../../Components/AdminNavBar";
import { customStyles } from "../../Components/customStyles/datatableCustom";
import { CoursesContext } from "../../contexts/CoursesContext";
import {
  changeCourseStatus,
  changeCourseVisibility,
  getAllCourseAdmin,
} from "../../services/coursesService";
import { Button, Image, Modal, Toast, ToastContainer } from "react-bootstrap";
import styled from "styled-components";
import userImg from "../../../images/user.png";

const CourseManager = () => {
  const { courses, setCourses } = useContext(CoursesContext);
  const [showPopup, setShowPopup] = useState(false);
  const [courseId, setCourseId] = useState(null);
  const [visibilityOrStatus, setVisibilityOrStatus] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");

  useEffect(() => {
    setTimeout(async () => {
      const listCourses = await getAllCourseAdmin();
      setCourses({ listCourses });
    }, 0);
  }, []);

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

      const courses2 = await getAllCourseAdmin();
      setCourses({ listCourses: courses2 });
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

  async function handleSearch(e) {
    e.preventDefault();
    console.log(await getAllCourseAdmin());
    const newCourses = (await getAllCourseAdmin()).filter(
      (course) =>
        course.title.toLowerCase().includes(e.target.value.toLowerCase()) ||
        course.description.toLowerCase().includes(e.target.value.toLowerCase())
    );
    console.log(newCourses);
    setCourses({ listCourses: newCourses });
  }
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
        <AdminNavBar />
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
        <h1 className="mt-3 mb-3"> Courses Manager</h1>

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
              onChange={handleSearch}
            />
          </div>
        </div>
        <DataTable
          columns={columns}
          data={courses.listCourses}
          fixedHeader
          pagination
          customStyles={customStyles}
        ></DataTable>
      </Col>
    </Row>
  );
};

export default CourseManager;
