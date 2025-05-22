import ErrorImg from "../../images/error.png";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";

const NotFoundPage = () => {
  return (
    <Container>
      <Image
        src={ErrorImg}
        className="object-fit-contain w-100"
        style={{ height: "500px" }}
      ></Image>
      <p className="text-center">
        The page you were looking for could not be found.
      </p>
    </Container>
  );
};

export default NotFoundPage;
