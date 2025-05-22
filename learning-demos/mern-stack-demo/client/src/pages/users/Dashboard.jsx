import { useContext, useEffect, useState } from "react";
import { deletePost, getUserPosts } from "../../controllers/postController";
import { UserContext } from "../../contexts/UserContext";
import Container from "react-bootstrap/esm/Container";
import Card from "react-bootstrap/Card";
import AnimatedProgressBar from "../../Components/AnimatedProgressBar";
import Post from "../../Components/Post";
import Stack from "react-bootstrap/Stack";
import {
  DangerAlert,
  InfoAlert,
  SuccessAlert,
} from "../../Components/CustomAlert";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { user, setUser } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    setTimeout(async () => {
      const { posts, email } = await getUserPosts();
      setUser({ ...user, email, posts: posts });
      setLoading(false);
    }, 0);
  }, []);

  const handleDelete = async (_id) => {
    if (confirm("Confirm delete?")) {
      try {
        const data = await deletePost(_id);
        setSuccess(data.success);
        const newPosts = user.posts.filter((post) => post._id != _id);
        setUser({ ...user, posts: newPosts });
      } catch (error) {
        setError(error.message);
      }
    }
    setTimeout(() => setSuccess(null), 2000);
  };

  return (
    <Container>
      <Card className="bg-body-tertiary">
        <Card.Body>
          <p className="mb-0">{user.email}</p>
          <Card.Title>User Dashboard</Card.Title>
          {success && <SuccessAlert msg={success} />}
          {error && <DangerAlert msg={error} />}
          <Card.Body>
            {loading && <AnimatedProgressBar />}
            {!loading && user.posts.length == 0 ? (
              <InfoAlert msg={"You do not have any post!"} />
            ) : (
              user.posts.map((post) => (
                <div key={post._id}>
                  <Post post={post}>
                    <Stack direction="horizontal" gap={3}>
                      <Link to="/update" title="Update" state={post}>
                        <i className="bi bi-pencil-square text-success" />
                      </Link>
                      <a
                        title="Delete"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleDelete(post._id)}
                      >
                        <i className="bi bi-trash text-danger" />
                      </a>
                    </Stack>
                  </Post>
                </div>
              ))
            )}
          </Card.Body>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Dashboard;
