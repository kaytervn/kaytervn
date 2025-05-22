import { useContext, useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/esm/Container";
import { getPosts } from "../../controllers/postController";
import Post from "../../Components/Post";
import { PostContext } from "../../contexts/PostContext";
import AnimatedProgressBar from "../../Components/AnimatedProgressBar";

const Home = () => {
  const { posts, setPosts } = useContext(PostContext);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(async () => {
      const data = await getPosts();
      setPosts(data.posts);
      setLoading(false);
    }, 0);
  }, []);

  return (
    <Container>
      <Card className="bg-body-tertiary">
        <Card.Body>
          <Card.Title>Latest posts</Card.Title>
          <Card.Body>
            {loading && <AnimatedProgressBar />}
            {posts &&
              posts.map((post) => (
                <div key={post._id}>
                  <Post post={post} />
                </div>
              ))}
          </Card.Body>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Home;
