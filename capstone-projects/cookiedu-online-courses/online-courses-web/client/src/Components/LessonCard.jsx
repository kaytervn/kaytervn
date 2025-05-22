const LessonCard = ({ lesson, children }) => {
  return (
    <>
      <div className="mb-5">
        <div className={`card h-100 bg-warning-subtle`} style={{ width: "1000px" }}>
          <div className="card-header">
            <div className="d-flex justify-content-between">
              <p className="fs-4 text-primary">{lesson.title}</p>
              <div>{children}</div>
            </div>
          </div>
          <div className="card-body">{lesson.description}</div>
          <div className="card-footer text-end">
            {new Date(lesson.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>
    </>
  );
};

export default LessonCard;
