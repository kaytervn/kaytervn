import { useContext, useEffect, useState } from "react";
import { UsersContext } from "../../contexts/UsersContext";
import {
  changeUserStatus,
  getUserListByRole,
} from "../../services/usersService";
import Role from "../../../../models/RoleEnum";
import Container from "react-bootstrap/Container";
import Alert from "../../Components/Alert";

import DataTable, {
  Alignment,
  createTheme,
  defaultThemes,
} from "react-data-table-component";
import FormCheckInput from "react-bootstrap/FormCheckInput";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Navbar from "react-bootstrap/Navbar";
import AdminNavBar from "../../Components/AdminNavBar";
import { Button, Modal, Table, Toast, ToastContainer } from "react-bootstrap";
import { customStyles } from "../../Components/customStyles/datatableCustom";

import Image from "react-bootstrap/esm/Image";
import "../../styles/dataTable.css";
import "../../styles/customBackdrop.css";
import { useNavigate } from "react-router-dom";
import userImg from "../../../images/user.png";

const UserManager = () => {
  const { users, setUsers } = useContext(UsersContext);
  const [showPopup, setShowPopup] = useState(false);
  const [userId, setUserId] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");

  const navigate = useNavigate();
  useEffect(() => {
    setTimeout(async () => {
      const students = await getUserListByRole(Role.STUDENT);
      setUsers({ students });
    }, 0);
  }, []);

  const cancelPopupStatus = () => {
    setShowPopup(false);
  };

  const confirmChangeStatus = async (e) => {
    e.preventDefault();
    // Xử lý confirm change status
    try {
      const message = await changeUserStatus(userId);
      const students = await getUserListByRole(Role.STUDENT);
      setUsers({ students });
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
    setUserId(id);
    setShowPopup(true);
  };

  const columns = [
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
      // width: "200px",
      textAlign: "center",
    },
    {
      name: "Email",
      selector: (row) => row.email,
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
    },
    {
      name: "Status",
      selector: (row) => (
        <div>
          {row.status ? (
            <div>
              <button
                className="btn btn-success"
                onClick={(e) => handleShowPopup(e, row._id)}
              >
                Enable
              </button>
            </div>
          ) : (
            <div>
              <button
                className="btn btn-danger"
                onClick={(e) => handleShowPopup(e, row._id)}
              >
                Disable
              </button>
            </div>
          )}
        </div>
      ),
      sortable: true,
    },
    {
      name: "Role",
      selector: (row) => row.role,
    },
    {
      name: "",
      selector: (row) => (
        <div className="d-flex justify-content-center">
          <button
            className="btn btn-outline-primary ms-3"
            onClick={(e) => {
              handleGotoDetail(e, row._id);
            }}
          >
            Detail
          </button>
        </div>
      ),
    },
  ];

  const handleGotoDetail = async (e, id) => {
    e.preventDefault();
    console.log(id);
    navigate(`/user`, { state: { userId: id } });
  };

  async function handleSearch(e) {
    console.log(await getUserListByRole(Role.STUDENT));
    const newStudents = (await getUserListByRole(Role.STUDENT)).filter(
      (student) =>
        student.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
        student.email.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setUsers({ students: newStudents });
  }

  // Simpler Toast Component
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
        <Container>
          {renderToast()}
          <Modal show={showPopup} onHide={cancelPopupStatus} centered>
            <Modal.Header closeButton>
              <Modal.Title>Confirm Change</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Are you sure you want to change status this student?
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={cancelPopupStatus}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={(e) => {
                  confirmChangeStatus(e, userId);
                }}
              >
                Confirm
              </Button>
            </Modal.Footer>
          </Modal>
          <h1 className="mt-3 mb-3"> Students Manager</h1>

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
            data={users.students}
            fixedHeader
            pagination
            customStyles={customStyles}
          ></DataTable>
        </Container>
      </Col>
    </Row>
  );
};

export default UserManager;
