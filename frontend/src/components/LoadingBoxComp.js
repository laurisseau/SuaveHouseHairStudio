import Spinner from "react-bootstrap/Spinner";
import Container from "react-bootstrap/Container";

export default function LoadingBoxComp() {
  return (
    <Container className=" d-flex flex-wrap justify-content-evenly">
      <Spinner animation="border" role="status">
        <span className="visually--hidden"></span>
      </Spinner>
    </Container>
  );
}
