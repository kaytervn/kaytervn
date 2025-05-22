import userImg from "../../images/user.png";

const CommentCard = ({ comment }) => {
  return (
    <>
      <div className="mb-3">
        <div className={`card h-100`}>
          <div className="card-header">
            <div className="row">
              <div className={`col-2`}>
                <img
                  src={
                    comment.userPicture !== "" ? comment.userPicture : userImg
                  }
                  className="object-fit-contain rounded-circle"
                  style={{ height: "50px" }}
                  alt="User Avatar"
                />
              </div>
              <div className="col">
                <b className="text-start text-primary">{comment.userName}</b>
                <p className="text-start">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
          <div className="card-body">{comment.content}</div>
        </div>
      </div>
    </>
  );
};

export default CommentCard;
