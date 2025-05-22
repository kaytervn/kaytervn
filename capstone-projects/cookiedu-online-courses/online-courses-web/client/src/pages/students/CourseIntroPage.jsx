import { Link, useLocation } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import AnimatedProgressBar from "../../Components/AnimatedProgressBar";
import { getCourse } from "../../services/coursesService";
import ReviewCard from "../../Components/ReviewCard";
import CourseIntroViewStudent from "../../Components/CourseIntroviewStudent";
import { Toast, ToastContainer } from "react-bootstrap";
import "react-toastify/dist/ReactToastify.css";
import { CartContext } from "../../contexts/CartContext";
import { addToCart, getCart } from "../../services/cartsService.js";
import { Card, Container, Row, Col, Pagination } from "react-bootstrap";
import { getMyCourse } from "../../services/invoiceService.js";
import { useNavigate } from "react-router-dom";

const CourseIntroPage = () => {
  const location = useLocation();
  console.log("Received state:", location.state);
  const [myCourses, setMyCourses] = useState([]);
  const [isCoursePurchased, setIsCoursePurchased] = useState(false);
  const { state } = useLocation();
  console.log("du lieu 2: ", state);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [formData, setFormData] = useState({
    _id: state._id,
    userId: state.userId,
    picture: state.picture,
    title: state.title,
    price: state.price,
    description: state.description,
    topic: state.topic,
    instructorName: state.instructorName,
    averageStars: 0,
    reviews: [],
  });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const { setItemCount } = useContext(CartContext);
  const [cartItems, setCartItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 5;
  const handleAddToCart = async (courseId) => {
    if (!isLoggedIn) {
      navigate("/login");
    } else {
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
    }
  };
  const checkLoginStatus = () => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  };
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

  useEffect(() => {
    checkLoginStatus();
    fetchData();
    setTimeout(async () => {
      const { reviews, averageStars } = await getCourse(formData._id);
      setFormData({
        ...formData,
        averageStars,
        reviews,
      });

      setLoading(false);
    }, 0);
    const fetchMyCourses = async () => {
      try {
        const data = await getMyCourse();
        setMyCourses(data.courses || []);
        setIsCoursePurchased(
          data.courses.some((course) => course._id === location.state._id)
        );
        setLoading(false);
      } catch (error) {
        console.error("Error fetching my courses: ", error);
        setLoading(false);
      }
    };

    fetchMyCourses();
  }, [location.state._id]);
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const ReviewsSection = ({
    reviewsPerPage,
    totalReviews,
    currentPage,
    handlePageChange,
    reviews,
  }) => {
    const totalPages = Math.ceil(totalReviews / reviewsPerPage);

    const indexOfLastReview = currentPage * reviewsPerPage;
    const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
    const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);

    return (
      <section className="p-5">
        <Container>
          {currentReviews.length === 0 ? (
            <p className="fs-2 text-center text-danger">There is no review.</p>
          ) : (
            <>
              {currentReviews.map((review) => (
                <div key={review._id}>
                  <ReviewCard review={review} />
                </div>
              ))}
            </>
          )}

          {}
          {totalPages > 1 && (
            <div className="d-flex justify-content-center mt-4">
              <Pagination>
                <Pagination.Prev
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                />
                {Array.from({ length: totalPages }).map((_, index) => (
                  <Pagination.Item
                    key={index}
                    active={index + 1 === currentPage}
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </Pagination.Item>
                ))}
                <Pagination.Next
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                />
              </Pagination>
            </div>
          )}
        </Container>
      </section>
    );
  };

  return (
    <>
      {renderToast()}
      {loading ? (
        <div className="container pt-5">
          <AnimatedProgressBar />
        </div>
      ) : (
        <>
          <CourseIntroViewStudent formData={formData}>
            {isLoggedIn ? (
              isCoursePurchased ? (
                <Link to="/course-details" state={location.state}>
                  <button className="btn btn-primary">
                    <i className="bi bi-eye-fill"></i> Course Detail
                  </button>
                </Link>
              ) : (
                <button
                  className="btn btn-success"
                  onClick={() => handleAddToCart(location.state._id)}
                >
                  <i className="bi bi-cart4"></i> Add To Cart
                </button>
              )
            ) : (
              <button
                className="btn btn-success"
                onClick={() => handleAddToCart(location.state._id)}
              >
                <i className="bi bi-cart4"></i> Add To Cart
              </button>
            )}
          </CourseIntroViewStudent>
          <ReviewsSection
            reviewsPerPage={reviewsPerPage}
            totalReviews={formData.reviews.length}
            currentPage={currentPage}
            handlePageChange={handlePageChange}
            reviews={formData.reviews}
          />
        </>
      )}
    </>
  );
};

export default CourseIntroPage;
