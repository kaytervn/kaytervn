import React, { useState, useEffect } from "react";
import { getMyCourse } from "../../services/invoiceService";
import MyCourseCard from "../../Components/MyCourseCard";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getMyReviewForCourse } from "../../services/reviewsService";
import { Form, Button } from "react-bootstrap";

const MyCoursePage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [coursesPerPage] = useState(3);

  useEffect(() => {
    const fetchCoursesAndReviews = async () => {
      try {
        const response = await getMyCourse();
        let fetchedCourses = response.courses || [];
        fetchedCourses.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        const coursesWithReviews = await Promise.all(
          fetchedCourses.map(async (course) => {
            const reviewData = await getMyReviewForCourse(course._id);
            console.log("review trong page", reviewData);
            return { ...course, review: reviewData || "Chưa review" };
          })
        );
        setCourses(coursesWithReviews);
      } catch (error) {
        setError("Lỗi khi tải khóa học: " + error.message);
      }
      setLoading(false);
    };

    fetchCoursesAndReviews();
  }, []);

  const lastCourseIndex = currentPage * coursesPerPage;
  const firstCourseIndex = lastCourseIndex - coursesPerPage;
  const currentCourses = courses.slice(firstCourseIndex, lastCourseIndex);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-3">
          <h4>Filter Courses</h4>
          <Form>
            <Form.Group>
              <Form.Label>Sort by Time</Form.Label>
              <Form.Control as="select">
                <option>Newest</option>
                <option>Oldest</option>
              </Form.Control>
            </Form.Group>
          </Form>
        </div>
        <div className="col-md-9">
          <h1>My Courses</h1>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          ) : (
            <>
              <div className="d-flex flex-column">
                {currentCourses.map((course) => (
                  <MyCourseCard key={course._id} course={course} />
                ))}
              </div>
              <div className="pagination">
                {[
                  ...Array(Math.ceil(courses.length / coursesPerPage)).keys(),
                ].map((x) => (
                  <Button
                    key={x + 1}
                    onClick={() => paginate(x + 1)}
                    className="page-item"
                  >
                    {x + 1}
                  </Button>
                ))}
              </div>
            </>
          )}
          <ToastContainer position="top-right" autoClose={3000} />
        </div>
      </div>
    </div>
  );
};


export default MyCoursePage;
