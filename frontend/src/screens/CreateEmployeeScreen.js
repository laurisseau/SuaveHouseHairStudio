import NavbarComp from "../components/NavbarComp";
import { useNavigate, Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import { Helmet } from "react-helmet-async";
import Button from "react-bootstrap/Button";
import Axios from "axios";
import { useContext, useState } from "react";
import { Store } from "../Store";
import { toast } from "react-toastify";
import { getError } from "../utils";

export default function CreateEmployeeScreen() {
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [password, setPassword] = useState("");
  const [key, setKey] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [position, setPosition] = useState("");
  const [isEmployee, setIsEmployee] = useState("");
  const [image, setImage] = useState();
  const [publishableKey, setPublishableKey] = useState("");
  const { state } = useContext(Store);
  const { employeeInfo } = state;

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      const formData = new FormData();

      formData.append("firstname", firstname);
      formData.append("lastname", lastname);
      formData.append("email", email);
      formData.append("number", number);
      formData.append("publishableKey", publishableKey);
      formData.append("key", key);
      formData.append("password", password);
      formData.append("confirmPassword", confirmPassword);
      formData.append("position", position);
      formData.append("isEmployee", isEmployee);
      formData.append("image", image);

      const data = await Axios.post("/api/employee/createEmployee", formData, {
        headers: { Authorization: `Bearer ${employeeInfo.token}` },
      });

      if (data) {
        navigate("/employees");
      }
    } catch (err) {
      toast.error(getError(err));
    }
  };

  return (
    <div>
      <NavbarComp color="dark" />
      <Container className="small-container">
        <Helmet>
          <title>Create Employee</title>
        </Helmet>
        <div className="mt-3">
          <Link to="/employees">
            <span className="material-symbols-outlined text-dark">
              arrow_back_ios
            </span>
          </Link>
        </div>
        <h1 className="my-3">Create Employee</h1>
        <Form onSubmit={submitHandler}>
          <Form.Group className="mb-3" controlId="firstname">
            <Form.Label>FirstName</Form.Label>
            <Form.Control
              type="firstname"
              required
              onChange={(e) => setFirstname(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="lastname">
            <Form.Label>Lastname</Form.Label>
            <Form.Control
              type="lastname"
              required
              onChange={(e) => setLastname(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="number">
            <Form.Label>Number</Form.Label>
            <Form.Control
              type="number"
              required
              onChange={(e) => setNumber(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="publishableKey">
            <Form.Label>Publishable Key</Form.Label>
            <Form.Control
              type="publishableKey"
              required
              onChange={(e) => setPublishableKey(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="key">
            <Form.Label>Secret Key</Form.Label>
            <Form.Control
              type="Key"
              required
              onChange={(e) => setKey(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-4" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-4" controlId="confirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              required
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-4" controlId="image">
            <Form.Label>image</Form.Label>
            <Form.Control
              type="file"
              required
              onChange={(e) => {
                setImage(e.target.files[0]);
              }}
            />
          </Form.Group>

          <Form.Group className="mb-5" controlId="position">
            <Form.Label>
              What position would you like this person to be in ?
            </Form.Label>
            {["Hairstylist", "Barber"].map((type) => (
              <Form.Check
                key={type}
                className="pt-2 ps-5 pe-5"
                type="radio"
                name="position"
                label={type}
                id={type}
                onChange={() => {
                  setPosition(type);
                }}
              />
            ))}
          </Form.Group>

          <Form.Group className="mb-3" controlId="isEmployee">
            <Form.Label>
              What role would you like this person to have ?
            </Form.Label>
            {["Employee", "Admin"].map((type) => (
              <Form.Check
                key={type}
                className="pt-2 ps-5 pe-5"
                type="radio"
                name="role"
                label={type}
                id={type}
                onChange={() => {
                  setIsEmployee(type);
                }}
              />
            ))}
          </Form.Group>

          {isCreating ? (
            <div className="mb-3 mt-5">
              <Button type="submit" disabled>
                Creating...
              </Button>
            </div>
          ) : (
            <div className="mb-3 mt-5">
              <Button type="submit">Create Employee</Button>
            </div>
          )}
        </Form>
      </Container>
    </div>
  );
}
