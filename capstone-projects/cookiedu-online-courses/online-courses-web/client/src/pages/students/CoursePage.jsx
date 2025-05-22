import "bootstrap/dist/css/bootstrap.min.css";
import { useContext, useEffect, useState } from "react";
import { searchCourses } from "../../services/coursesService";
import AnimatedProgressBar from "../../Components/AnimatedProgressBar";
import CourseCard from "../../Components/CourseCard";
import Topic from "../../../../models/TopicEnum.js";
import { CoursesContext } from "../../contexts/CoursesContext.jsx";
import imgSample from "../../../images/course.png";
import { useNotification } from "../../contexts/NotificationContext ";
//import { addToCart } from "../../services/cartsService.js";
import { Toast, ToastContainer } from "react-bootstrap";
import { addToCart, getCart } from "../../services/cartsService.js";
import { CartContext } from "../../contexts/CartContext";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const CoursePage = () => {
  const { courses, setCourses } = useContext(CoursesContext);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("ALL");
  const [selectedSort, setSelectedSort] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pages, setPages] = useState([]);
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const { setItemCount } = useContext(CartContext);
  const [cartItems, setCartItems] = useState([]);

  const topics = [
    "ALL",
    Topic.WEB,
    Topic.AI,
    Topic.DATA,
    Topic.MOBILE,
    Topic.GAME,
    Topic.SOFTWARE,
  ];
  const navigate = useNavigate();
  const handleAddToCart = async (courseId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      const result = await addToCart(courseId);
      setToastMessage("Thêm vào giỏ hàng thành công!");
      setToastType("success");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 5000);
      fetchData();
      setItemCount(cartItems.length + 1);
    } catch (error) {
      setToastMessage(error.toString());
      setToastType("danger");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 5000);
    }
  };

  const handleSearch = async () => {
    setCurrentPage(1);
    await updateDisplay();
  };

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
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    );
  };
  const updateDisplay = async () => {
    setLoading(true);
    const data = await searchCourses({
      keyword: searchValue,
      topic: selectedTopic,
      page: currentPage,
      sort: selectedSort,
    });
    setCourses({ ...courses, listCourses: data.courses });
    setPages(Array.from({ length: data.totalPages }, (_, index) => index + 1));
    setTotalPages(data.totalPages);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    if (notification.message) {
      if (notification.type === "success") {
        updateDisplay();
      }
    }
    setTimeout(async () => {
      await updateDisplay();
    }, 100);
  }, [selectedTopic, selectedSort, currentPage, notification]);
  const fetchData = async () => {
    try {
      const data = await getCart();
      if (data) {
        setCartItems(data.courseDetails);
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };
  return (
    <>
      {/* {notification.message && (
        <div
          className={`alert alert-${
            notification.type === "success" ? "success" : "danger"
          }`}
        >
          {notification.message}
        </div>
      )}     */}
      {renderToast()}
      <section className="bg-dark text-light p-lg-0 pt-lg-5 text-center text-sm-start">
        <div className="container">
          <div className="d-sm-flex align-items-center justify-content-between">
            <div>
              <h1>
                <span className="text-warning">COOKI</span>EDU Courses
              </h1>
              <p className="lead my-4">
                Choosing suitable courses is essential for connecting with the
                world of technology:
              </p>
              <p className="list-group-item bg-dark text-light">
                <b>1. </b>
                Explore programming languages for software development.
              </p>
              <p className="list-group-item bg-dark text-light">
                <b>2.</b> Dive into data science for valuable insights.
              </p>
              <p className="list-group-item bg-dark text-light">
                <b>3.</b> Learn about emerging technologies like AI and
                cybersecurity.
              </p>
              <p className="list-group-item bg-dark text-light">
                <b>4.</b> Gain skills in digital marketing for global
                connectivity.
              </p>
              <p className="list-group-item bg-dark text-light">
                <b>5. </b>
                Explore entrepreneurship for leveraging technology in business.
              </p>
              <p className="my-4">
                By selecting courses strategically, individuals can bridge the
                gap between aspirations and achievements in the tech industry,
                shaping a brighter future together.
              </p>
            </div>
            <img
              className="img-fluid w-50 d-none d-sm-block d-md-block"
              src={imgSample}
            />
          </div>
        </div>
      </section>
      <section className="bg-primary text-light p-5">
        <div className="container">
          <div className="row">
            <div className="d-md-flex justify-content-between align-items-center">
              <div className="col-4">
                <h2 className="mb-3 mb-md-0">
                  What are you <span className="text-warning">looking </span>
                  for?
                </h2>
              </div>
              <div className="col">
                <div className="input-group news-input">
                  <span className="input-group-text">
                    <i className="fa fa-search" aria-hidden="true"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search..."
                    value={searchValue}
                    onChange={(e) => {
                      e.preventDefault();
                      setSearchValue(e.target.value);
                    }}
                  />
                  <div className="btn btn-success" onClick={handleSearch}>
                    Search
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="p-5">
        <div className="container">
          {loading ? (
            <AnimatedProgressBar />
          ) : (
            <div className="row">
              <div className="col-2">
                <div className="input-group pb-4">
                  <span className="input-group-text bg-warning text-light">
                    <i className="fa fa-sort" aria-hidden="true"></i>
                  </span>
                  <select
                    className="form-select"
                    value={selectedSort}
                    onChange={(e) => {
                      e.preventDefault();
                      setCurrentPage(1);
                      setSelectedSort(e.target.value);
                    }}
                  >
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                    <option value="highestPrice">Highest Price</option>
                    <option value="lowestPrice">Lowest Price</option>
                  </select>
                </div>
                <ul className="list-group">
                  <li className="list-group-item bg-warning text-light text-center">
                    <b>Topic</b>
                  </li>
                  {topics.map((topic) => (
                    <li className="list-group-item" key={topic}>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          value={topic}
                          checked={selectedTopic === topic}
                          onChange={(e) => {
                            e.preventDefault();
                            setSelectedTopic(topic);
                            setCurrentPage(1);
                          }}
                          id={`radio-${topic}`}
                        />
                        <label
                          className="form-check-label"
                          htmlFor={`radio-${topic}`}
                        >
                          {topic.toUpperCase()}
                        </label>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="col">
                <div className="row row-cols-1 row-cols-md-3 g-4 pb-4">
                  {courses.listCourses.length === 0 ? (
                    <p className="fs-2 text-center text-danger">Not Found.</p>
                  ) : (
                    <>
                      {courses.listCourses.map((course) => (
                        <div key={course._id}>
                          <CourseCard course={course}>
                            <div className="pe-2 flex-grow-1">
                              <Link
                                to="/course-intro"
                                state={course}
                                className="btn btn-outline-primary w-100"
                              >
                                View Intro
                              </Link>
                            </div>
                            <a
                              href="#"
                              className="btn btn-outline-warning"
                              onClick={(e) => {
                                e.preventDefault();
                                handleAddToCart(course._id);
                              }}
                            >
                              <i className="bi bi-cart4"></i>
                            </a>
                          </CourseCard>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
      {!loading && pages.length > 0 && (
        <div className="d-flex justify-content-center">
          <ul className="pagination">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <a
                className="page-link"
                href=""
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage(currentPage - 1);
                }}
              >
                Previous
              </a>
            </li>
            {pages.map((page) => (
              <li
                key={page}
                className={`page-item ${currentPage === page ? "active" : ""}`}
                aria-current={currentPage === page ? "page" : null}
              >
                <a
                  className="page-link"
                  href=""
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage(page);
                  }}
                >
                  {page}
                </a>
              </li>
            ))}
            <li
              className={`page-item ${
                currentPage === totalPages ? "disabled" : ""
              }`}
            >
              <a
                className="page-link"
                href=""
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage(currentPage + 1);
                }}
              >
                Next
              </a>
            </li>
          </ul>
        </div>
      )}
    </>
  );
};

export default CoursePage;
