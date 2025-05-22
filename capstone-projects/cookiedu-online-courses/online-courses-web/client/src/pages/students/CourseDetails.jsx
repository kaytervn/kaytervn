import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { deleteLesson, getCourseLessons } from "../../services/lessonsService";
import CourseIntroView from "../../Components/CourseIntroView";
import AnimatedProgressBar from "../../Components/AnimatedProgressBar";
import LessonCard from "../../Components/LessonCard";
import { deleteCourse } from "../../services/coursesService";
import { MyAlert } from "../../Components/CustomAlert";
import { getCourse } from "../../services/coursesService";

const CourseDetails = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({
    message: "",
    variant: "",
  });
  const [formData, setFormData] = useState({
    _id: state._id,
    userId: state.userId,
    picture: state.picture,
    title: state.title,
    price: state.price,
    description: state.description,
    topic: state.topic,
    instructorName: state.instructorName,
    averageStars: state.averageStars,
    lessons: [],
  });

  useEffect(() => {
    console.log("form data", formData);
    setTimeout(async () => {
      const { reviews, averageStars } = await getCourse(formData._id);
      const lessons = await getCourseLessons(formData._id);
      setFormData({
        ...formData,
        averageStars,
        lessons,
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
          <CourseIntroView formData={formData}></CourseIntroView>
          <section className="p-5">
            <div className="container d-flex justify-content-center flex-wrap">
              {formData.lessons.length === 0 ? (
                <p className="fs-2 text-center text-danger">
                  No lesson created.
                </p>
              ) : (
                <>
                  {alert.message != "" && (
                    <div style={{ width: "1000px" }}>
                      <MyAlert msg={alert.message} variant={alert.variant} />
                    </div>
                  )}
                  {formData.lessons.map((lesson) => (
                    <div key={lesson._id}>
                      <LessonCard lesson={lesson}>
                        <Link to="/lesson-details" state={lesson}>
                          <button className="btn btn-success">
                            View Lesson Details
                          </button>
                        </Link>
                      </LessonCard>
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

export default CourseDetails;
