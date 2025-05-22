import userImg from "../../images/user.png";

const ReviewCard = ({ review }) => {
  return (
    <>
      <div className="mb-5">
        <div className={`card h-100`} style={{ width: "1000px" }}>
          <div className="card-header">
            <div className="row">
              <div className="col-1">
                <img
                  src={review.userPicture != "" ? review.userPicture : userImg}
                  className="object-fit-contain rounded-circle"
                  style={{ height: "50px" }}
                />
              </div>
              <div className="col">
                <b className="text-start text-primary">{review.userName}</b>
                <p className="text-start">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
          <div className="card-body">{review.content}</div>
          <div className="card-footer">
            <p className="text-warning lead">
              {[...Array(5)].map((_, index) => {
                if (index < Math.floor(review.ratingStar)) {
                  return <i key={index} className="bi bi-star-fill"></i>;
                } else if (
                  index === Math.floor(review.ratingStar) &&
                  review.ratingStar % 1 !== 0
                ) {
                  return <i key={index} className="bi bi-star-half"></i>;
                } else {
                  return <i key={index} className="bi bi-star"></i>;
                }
              })}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReviewCard;
