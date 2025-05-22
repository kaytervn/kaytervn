const CourseIntroViewStudent = ({ formData, children }) => {
  console.log("trung binhf", formData.averageStars)
  return (
    <>
      <section className="bg-dark text-light">
        <div className="container">
          <div className="row">
            <div className="col-5">
              <img
                src={formData.picture}
                className="object-fit-contain rounded mb-5"
                style={{ width: "500px" }}
              />
            </div>
            <div className="col">
              <div className="d-flex justify-content-between">
                <p className="lead fs-3">{formData.title}</p>
                <div>{children}</div>
              </div>
              <div className="d-flex justify-content-between">
                <div
                  className="badge text-bg-primary text-wrap mb-5"
                  style={{ height: "30px" }}
                >
                  <p className="lead">🎓​{formData.instructorName}</p>
                  <div className="text-warning">
                    <p className="lead">
                      {[...Array(5)].map((_, index) => {
                        if (index < Math.floor(formData.averageStars)) {
                          return (
                            <i key={index} className="bi bi-star-fill"></i>
                          );
                        } else if (
                          index === Math.floor(formData.averageStars) &&
                          formData.averageStars % 1 !== 0
                        ) {
                          return (
                            <i key={index} className="bi bi-star-half"></i>
                          );
                        } else {
                          return <i key={index} className="bi bi-star"></i>;
                        }
                      })}
                      
                      {`${formData.averageStars}`}
                    </p>
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <p className="fs-1 text-info">💲{formData.price}</p>
                  </div>
                  <div className="col">
                    <div
                      className="badge text-bg-secondary text-wrap"
                      style={{ height: "30px" }}
                    >
                      <p className="lead">​​​{formData.topic}</p>
                    </div>
                  </div>
                </div>
              </div>
              <p className="fs-5">{formData.description}</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CourseIntroViewStudent;
