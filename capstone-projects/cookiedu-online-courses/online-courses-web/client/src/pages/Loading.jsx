import Container from "react-bootstrap/Container";
import loading from "../../images/loading.png";
import Image from "react-bootstrap/Image";

const Loading = () => {
  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Image
        src={loading}
        className="img-fluid"
        style={{ maxWidth: "100px", maxHeight: "100px" }}
      />
    </Container>
  );
};

export default Loading;
