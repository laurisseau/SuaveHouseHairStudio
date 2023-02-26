import NavbarComp from "../components/NavbarComp";
import { useLocation, Link, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import { Helmet } from "react-helmet-async";
import Button from "react-bootstrap/Button";
import Axios from "axios";
import { useContext, useState, useEffect } from "react";
import { Store } from "../Store";
import { toast } from "react-toastify";
import { getError } from "../utils";

export default function EmployeeSigninScreen() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get("redirect");
  const redirect = redirectInUrl ? redirectInUrl : "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { employeeInfo } = state;

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await Axios.post("/api/employee/signin", {
        email,
        password,
      });
      ctxDispatch({ type: "EMPLOYEE_SIGNIN", payload: data });
      localStorage.setItem("employeeInfo", JSON.stringify(data));
      navigate(redirect || "/");
    } catch (err) {
      toast.error(getError(err));
    }
  };

  useEffect(() => {
    if (employeeInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, employeeInfo]);

  return (
    <div>
      <NavbarComp color="dark" />
      <Container className="small-container">
        <Helmet>
          <title>Employee Sign In</title>
        </Helmet>
        <h1 className="my-3">Employee Sign In</h1>
        <Form onSubmit={submitHandler}>
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
          <div className="mb-3">
            <Link to={`/forgotPassword`}>Forgot Password?</Link>
          </div>
          <div className="mb-3">
            <Button type="submit">Sign In</Button>
          </div>
        </Form>
      </Container>
    </div>
  );
}
