import axios from "axios";
import { useReducer, useEffect } from "react";
import EmployeeComp from "../components/EmployeeComp";
import NavbarComp from "../components/NavbarComp";
import { Helmet } from "react-helmet-async";
import LoadingBoxComp from "../components/LoadingBoxComp";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/esm/Container";
import { Link } from "react-router-dom";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, employee: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function HomeScreen() {
  const [{ loading, employee }, dispatch] = useReducer(reducer, {
    loading: true,
    employee: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const result = await axios.get("/api/employee/getEmployee");
        dispatch({ type: "FETCH_SUCCESS", payload: result.data });
      } catch (err) {
        //dispatch({ type: 'FETCH_FAIL', payload: err });
        console.log(err);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <header
        className="background-img"
        style={{
          height: "100vh",
          backgroundSize: "100% 100%",
        }}
      >
        <Helmet>
          <title>Home</title>
        </Helmet>

        <NavbarComp />

        <div className="title">
          <h3>- Suave House -</h3>
          <h1>BARBERSHOP</h1>
        </div>
      </header>

      <Container>
        <Row className="d-flex justify-content-center mt-5  ">
          <Col md={{ span: 10, offset: 0 }} lg={{ span: 5, offset: 0 }}>
            <div className="mb-5" style={{ height: "600px" }}>
              <img
                alt="hair dresser"
                className=""
                style={{ height: "100%", width: "100%" }}
                src="https://images.unsplash.com/photo-1560869713-bf165a9cfac1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=626&q=80"
              ></img>
            </div>
          </Col>
          <Col
            className="text-center d-flex align-self-center "
            md={{ span: 10, offset: 0 }}
            lg={{ span: 5, offset: 0 }}
          >
            <div>
              <h1>About Us</h1>
              <p style={{ fontSize: "18px", lineHeight: "2" }}>
                Welcome to our barber shop! We are dedicated to providing
                exceptional grooming services to all of our clients. Our skilled
                barbers have years of experience and are passionate about their
                craft, which means you can trust us to give you a haircut that
                looks great and suits your unique style. Our shop is designed to
                create a comfortable and welcoming environment for everyone who
                walks through our doors. We believe that getting a haircut
                should be a relaxing and enjoyable experience, which is why we
                go the extra mile to make sure our clients feel at home. We
                offer a range of services, including haircuts, beard trims, hot
                towel shaves, and more. We use only the highest-quality
                products, so you can be sure that your hair and skin will be
                treated with care and attention.
              </p>
            </div>
          </Col>
        </Row>

        <Row className="mt-5">
          <h1
            className="text-center border-bottom pb-3"
            style={{ fontSize: "64px" }}
          >
            Meet Our Crew
          </h1>

          {loading ? (
            <div className="mt-5">
              <LoadingBoxComp />{" "}
            </div>
          ) : (
            employee.map((x) => (
              <Col key={x._id} sm={6} md={4} lg={3} className="mb-3">
                <EmployeeComp x={x} />
              </Col>
            ))
          )}
        </Row>

        <Row
          className="mb-5 mt-5 overlay"
          style={{
            color: "white",
            height: "450px",
            backgroundSize: "100% 450px",
            backgroundImage:
              "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),url(https://images.unsplash.com/photo-1493256338651-d82f7acb2b38?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80)",
          }}
        >
          <Col
            style={{ height: "300px" }}
            className="rel d-flex justify-content-center align-self-center text-center "
            md={{ span: 6, offset: 3 }}
          >
            <Row>
              <Col style={{ fontSize: "90px" }}>❝</Col>
            </Row>

            <div className="d-flex align-self-center ">
              <div>
                <p
                  className="border-bottom pb-2 "
                  style={{ marginTop: "40px" }}
                >
                  WHAT THEY SAID
                </p>
                <p style={{ fontSize: "28px", paddingTop: "" }}>
                  Overall, I would highly recommend this barbershop to anyone looking for a great haircut and an enjoyable experience.
                </p>
                <p style={{ fontSize: "24px" }}>JOHN</p>
              </div>
            </div>
            <Row>
              <Col style={{ fontSize: "90px", paddingTop: "220px" }}>❞</Col>
            </Row>
          </Col>
        </Row>
      </Container>

      <footer
        style={{ backgroundColor: "#252525", height: "170px", color: "white" }}
      >
        <Container
          className="d-flex justify-content-md-between align-items-center flex-wrap justify-content-center"
          style={{ height: "100%" }}
        >
          <div>
            <h1 style={{ fontSize: "18px" }}>© 2023 SUAVE HOUSE BARBER SHOP</h1>
            <div className="d-flex justify-content-center ">
              <Link to="/employeeSignin">Employee?</Link>
            </div>
          </div>

          <div>
            <h1 style={{ fontSize: "18px" }}>
              WEB DESIGN BY LAURISSEAU JOSEPH
            </h1>
          </div>
        </Container>
      </footer>
    </div>
  );
}
