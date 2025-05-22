// MyCourseCard.jsx
import React, { useState, useEffect } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { createReview, getMyReviewForCourse } from "../services/reviewsService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MyCourseCard = ({ course }) => {
  const [showModal, setShowModal] = useState(false);
  const [review, setReview] = useState(null);
  const [ratingStar, setRatingStar] = useState(5);
  const [content, setContent] = useState("");

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const reviewData = await getMyReviewForCourse(course._id);
        setReview(reviewData || null);
        setRatingStar(reviewData?.ratingStar || 5);
        setContent(reviewData?.content || "");
      } catch (error) {
        console.error("Error fetching review:", error);
      }
    };

    fetchReview();
  }, [course._id]);

  const hasReview =
    review && review.content && typeof review.ratingStar === "number";

  const handleReviewSubmit = async () => {
    try {
      const reviewData = {
        ratingStar,
        content,
      };
      const data = await createReview(course._id, reviewData);
      console.log("id course", course._id)
      console.log("noi dung: ", reviewData);
      console.log("data", data)
      if (data.message) {
        setShowModal(false);
        if (data.message === "You have already reviewed this course.") {
          toast.error("Error: " + data.message);
        } else {
          setReview({ content, ratingStar });
          toast.success(data.message);
        }
      } else if (data.error) {
        toast.error("Error: " + data.error);
      }
    } catch (error) {
      toast.error("Failed to submit review: " + error.message);
    }
  };

  const renderRatingStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <i
          key={i}
          className={i <= ratingStar ? "fas fa-star" : "far fa-star"}
          style={{
            color: i <= ratingStar ? "gold" : "grey",
            cursor: "pointer",
          }}
          onClick={() => setRatingStar(i)}
        />
      );
    }
    return stars;
  };

  return (
    <div className="card mb-3" style={{ maxWidth: "540px" }}>
      <div className="row g-0">
        <div className="col-md-4">
          <img
            src={course.picture}
            className="img-fluid rounded-start"
            alt={course.title}
          />
        </div>
        <div className="col-md-8">
          <div className="card-body">
            <h5 className="card-title">{course.title}</h5>
            <p className="card-text">🎓​{course.instructorName}</p>
            <p className="card-text">{course.description}</p>
            <p className="card-text">
              <strong>My Review:</strong>{" "}
              <span style={{ color: hasReview ? "green" : "red" }}>
                {hasReview
                  ? `${review.content} (${review.ratingStar} stars)`
                  : "You have not rated this course yet."}
              </span>
            </p>
            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
              <Button variant="primary">
                <Link
                  to="/course-intro"
                  state={course}
                  style={{ color: "inherit", textDecoration: "none" }}
                >
                  View Intro
                </Link>
              </Button>
              <Button variant="primary" onClick={() => setShowModal(true)}>
                Review
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Course</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="ratingStar">
              <Form.Label>Star</Form.Label>
              <div>{renderRatingStars()}</div>
            </Form.Group>
            <Form.Group controlId="content">
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleReviewSubmit}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MyCourseCard;
