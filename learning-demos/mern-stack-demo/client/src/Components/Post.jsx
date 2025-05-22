import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import BlankImg from "../../images/blank.png";

const Post = ({ post, children }) => {
  return (
    <Card className="mb-2">
      <Card.Body className="d-flex">
        <Image
          style={{ width: "200px"}}
          src={post.image || BlankImg}
          className="object-fit-contain h-100"
          thumbnail
        />
        <div className="px-3 flex-grow-1">
          <b className="text-primary mb-0">{post.title}</b>
          <p style={{ fontSize: "12px" }}>
            {new Date(post.createdAt).toLocaleDateString()}
          </p>
          <div>{post.body}</div>
        </div>
        <div>{children}</div>
      </Card.Body>
    </Card>
  );
};

export default Post;
