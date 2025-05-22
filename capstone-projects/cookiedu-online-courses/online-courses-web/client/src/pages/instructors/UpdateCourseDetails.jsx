import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { deleteLesson, getCourseLessons } from "../../services/lessonsService";
import CourseIntroView from "../../Components/CourseIntroView";
import AnimatedProgressBar from "../../Components/AnimatedProgressBar";
import LessonCard from "../../Components/LessonCard";
import { deleteCourse } from "../../services/coursesService";
import { MyAlert } from "../../Components/CustomAlert";

const UpdateCourseDetails = () => {
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
    setTimeout(async () => {
      const lessons = await getCourseLessons(formData._id);
      setFormData({
        ...formData,
        lessons,
      });
      setLoading(false);
    }, 0);
  }, []);

  const handleDelete = async (_id) => {
    if (confirm("Confirm delete course?")) {
      try {
        await deleteCourse(_id);
        navigate("/");
      } catch (error) {
        console.log(error.message);
      }
    }
  };

  const handleDeleteLesson = async (_id) => {
    if (confirm("Confirm delete lesson?")) {
      try {
        const data = await deleteLesson(_id);
        setAlert({ ...alert, message: data.success, variant: "success" });
        const newLessons = formData.lessons.filter(
          (lesson) => lesson._id != _id
        );
        setFormData({ ...formData, lessons: newLessons });
      } catch (error) {
        setAlert({ ...alert, message: error.message, variant: "danger" });
      }
    }
    setTimeout(() => setAlert({ ...alert, message: "", variant: "" }), 2000);
  };

  return (
    <>
      {loading ? (
        <div className="container pt-5">
          <AnimatedProgressBar />
        </div>
      ) : (
        <>
          <CourseIntroView formData={formData}>
            <Link to="/create-lesson" state={formData}>
              <button className="btn btn-primary me-2">
                📁​ Create Lesson
              </button>
            </Link>
            <button
              className="btn btn-danger"
              onClick={() => handleDelete(formData._id)}
            >
              <i className="bi bi-trash-fill"></i> Delete Course
            </button>
          </CourseIntroView>
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
                        <Link to="/update-lesson" state={lesson}>
                          <button className="btn btn-primary me-2">
                            <i className="bi bi-pencil-square"></i>
                          </button>
                        </Link>
                        <button
                          className="btn btn-danger me-2"
                          onClick={() => handleDeleteLesson(lesson._id)}
                        >
                          <i className="bi bi-trash-fill"></i>
                        </button>
                        <Link to="/update-lesson-details" state={lesson}>
                          <button className="btn btn-success">
                            Edit Lesson
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

export default UpdateCourseDetails;
