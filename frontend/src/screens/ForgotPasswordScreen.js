import NavbarComp from "../components/NavbarComp";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import { Helmet } from "react-helmet-async";
import Button from "react-bootstrap/Button";
import Axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import { getError } from "../utils";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await Axios.post("/api/users/forgotPassword", {
        email,
      });

      toast.success(data.message);
    } catch (err) {
      toast.error(getError(err));
    }
  };

  return (
    <div>
      <NavbarComp color="dark" />
      <Container className="small-container">
        <Helmet>
          <title>Forgot Password</title>
        </Helmet>
        <h1 className="my-3">Forgot Password</h1>
        <Form onSubmit={submitHandler}>
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>
          <div className="mb-3">
            <Button type="submit">Submit</Button>
          </div>
        </Form>
      </Container>
    </div>
  );
}
