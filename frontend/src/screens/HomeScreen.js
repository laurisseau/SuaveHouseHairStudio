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
          <h3>- Magic Style -</h3>
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
                Welcome to Magic Style Barber Shop, your premier family barber
                shop in Orlando, FL. We specialize in a wide spectrum of hair
                and beard trimming services, ensuring that you get the utmost
                level of quality and professionalism. Our barbers strive to meet
                and exceed your expectations! With more than 10 years of
                experience, our family-owned barber shop is passionate about
                delivering only the finest and highest quality service for all
                our clients. With a keen eye for detail, we want to make sure
                that you are completely satisfied with the results. Contact or
                visit us at Magic Style Barber Shop today and let us show you
                how committed we are to ensuring superior quality service!
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
                  IT'S JUST A GREAT GROUP OF GUYS MAKING THE WORLD A BETTER
                  LOOKING PLACE
                </p>
                <p style={{ fontSize: "24px" }}>AMANDA</p>
              </div>
            </div>
            <Row>
              <Col style={{ fontSize: "90px", paddingTop: "220px" }}>❞</Col>
            </Row>
          </Col>
        </Row>
      </Container>

      <footer
        style={{ backgroundColor: "#000", height: "170px", color: "white" }}
      >
        <Container
          className="d-flex justify-content-md-between align-items-center flex-wrap justify-content-center"
          style={{ height: "100%" }}
        >
          <div>
            <h1 style={{ fontSize: "18px" }}>© 2022 PARKER'S BARBER SHOP</h1>
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
