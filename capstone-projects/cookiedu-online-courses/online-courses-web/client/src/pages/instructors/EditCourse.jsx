import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import AnimatedProgressBar from "../../Components/AnimatedProgressBar";
import { getCourse } from "../../services/coursesService";
import ReviewCard from "../../Components/ReviewCard";
import CourseIntroView from "../../Components/CourseIntroView";
const UpdateCourseIntro = () => {
  const { state } = useLocation();
  const [loading, setLoading] = useState(true);
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
  console.log("du lieu: ", formData);
  useEffect(() => {
    setTimeout(async () => {
      const { reviews, averageStars } = await getCourse(formData._id);
      setFormData({
        ...formData,
        averageStars,
        reviews,
      });
      setLoading(false);
    }, 0);
  }, []);

  return (
    <>
      {loading ? (
        <div className="container pt-5">
          <AnimatedProgressBar />
        </div>
      ) : (
        <>
          <CourseIntroView formData={formData}>
            <Link to="/update-course-intro" state={formData}>
              <button className="btn btn-success me-2">
                <i className="bi bi-pencil-square"></i> Edit Intro
              </button>
            </Link>
            <Link to="/update-course-details" state={formData}>
              <button className="btn btn-primary">
                <i className="bi bi-pencil-square"></i> Edit Details
              </button>
            </Link>
          </CourseIntroView>
          <section className="p-5">
            <div className="container d-flex justify-content-center flex-wrap">
              {formData.reviews.length === 0 ? (
                <p className="fs-2 text-center text-danger">
                  There is no review.
                </p>
              ) : (
                <>
                  {formData.reviews.map((review) => (
                    <div key={review._id}>
                      <ReviewCard review={review}></ReviewCard>
                    </div>
                  ))}
                </>
              )}
            </div>
          </section>
        </>
      )}
    </>
  );
};
export default UpdateCourseIntro;
