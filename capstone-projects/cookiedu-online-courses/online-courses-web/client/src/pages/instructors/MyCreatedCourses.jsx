import { useContext, useEffect, useState } from "react";
import {
  changeCourseVisibility,
  searchUserCourses,
} from "../../services/coursesService";
import AnimatedProgressBar from "../../Components/AnimatedProgressBar";
import CourseCard from "../../Components/CourseCard";
import Topic from "../../../../models/TopicEnum";
import { UserContext } from "../../contexts/UserContext";
import "../../styles/cardHover.css";
import { Link } from "react-router-dom";

const MyCreatedCourses = () => {
  const { user, setUser } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({
    message: "",
    variant: "",
  });

  const [searchValue, setSearchValue] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("ALL");
  const [selectedVisibility, setSelectedVisibility] = useState("ALL");
  const [selectedSort, setSelectedSort] = useState("lastUpdated");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pages, setPages] = useState([]);

  const topics = [
    "ALL",
    Topic.WEB,
    Topic.AI,
    Topic.DATA,
    Topic.MOBILE,
    Topic.GAME,
    Topic.SOFTWARE,
  ];
  const visibilities = ["ALL", true, false];

  const handleChangeVisibility = async (courseId) => {
    if (confirm("Confirm change visibility?")) {
      try {
        const data = await changeCourseVisibility(courseId);
        setAlert({ ...alert, message: data.success, variant: "success" });
      } catch (error) {
        setAlert({ ...alert, message: error.message, variant: "danger" });
      }
      setAlert({ ...alert, message: "", variant: "" });
    }
  };

  const handleSearch = async () => {
    setCurrentPage(1);
    await updateDisplay();
  };

  const updateDisplay = async () => {
    setLoading(true);
    const data = await searchUserCourses({
      keyword: searchValue,
      visibility: selectedVisibility,
      topic: selectedTopic,
      page: currentPage,
      sort: selectedSort,
    });
    setUser({
      ...user,
      createdCourses: data.courses,
    });
    setPages(Array.from({ length: data.totalPages }, (_, index) => index + 1));
    setTotalPages(data.totalPages);
    setLoading(false);
  };

  useEffect(() => {
    setTimeout(async () => {
      await updateDisplay();
    }, 100);
  }, [selectedTopic, selectedVisibility, selectedSort, currentPage, alert]);

  return (
    <>
      <section className="bg-primary text-light p-5">
        <div className="container">
          <div className="row">
            <div className="d-md-flex justify-content-between align-items-center">
              <div className="col-3">
                <h2 className="mb-3 mb-md-0">
                  My <span className="text-warning">Created</span> Courses
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
            <>
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
                      <option value="lastUpdated">Last Updated</option>
                      <option value="title">Title</option>
                    </select>
                  </div>
                  <ul className="list-group pb-4">
                    <li className="list-group-item bg-warning text-light text-center">
                      <b>Visibility</b>
                    </li>
                    {visibilities.map((visibility) => (
                      <li className="list-group-item" key={visibility}>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            value={visibility}
                            checked={selectedVisibility === visibility}
                            onChange={(e) => {
                              e.preventDefault();
                              setSelectedVisibility(visibility);
                              setCurrentPage(1);
                            }}
                          />
                          <label className="form-check-label">
                            {visibility === false
                              ? "PRIVATE"
                              : visibility === true
                              ? "PUBLIC"
                              : visibility}
                          </label>
                        </div>
                      </li>
                    ))}
                  </ul>
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
                    {user.createdCourses.length === 0 ? (
                      <p className="fs-2 text-center text-danger">Not Found.</p>
                    ) : (
                      <>
                        {user.createdCourses.map((course) => (
                          <div key={course._id}>
                            <CourseCard course={course}>
                              <div className="pe-2 flex-grow-1">
                                <Link
                                  to="/edit-course"
                                  title="Edit"
                                  state={course}
                                  className="btn btn-outline-dark w-100"
                                >
                                  <i className="bi bi-pencil-square"></i> Edit
                                </Link>
                              </div>
                              {course.visibility == false ? (
                                <div
                                  className="btn btn-outline-success"
                                  onClick={() =>
                                    handleChangeVisibility(course._id)
                                  }
                                >
                                  <i className="bi bi-eye"></i>
                                </div>
                              ) : (
                                <div
                                  className="btn btn-outline-danger"
                                  onClick={() =>
                                    handleChangeVisibility(course._id)
                                  }
                                >
                                  <i className="bi bi-eye-slash"></i>
                                </div>
                              )}
                            </CourseCard>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </>
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

export default MyCreatedCourses;
