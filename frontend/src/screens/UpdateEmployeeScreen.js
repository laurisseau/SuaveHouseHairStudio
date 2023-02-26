import NavbarComp from "../components/NavbarComp";
import { useNavigate, useParams } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import { Helmet } from "react-helmet-async";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { useContext, useState, useEffect } from "react";
import { Store } from "../Store";
import { toast } from "react-toastify";
import { getError } from "../utils";

export default function UpdateEmployeeScreen() {
  const [isUpdating, setisUpdating] = useState(false);
  const params = useParams();
  const { id } = params;

  const [seeEmployee, setSeeEmployee] = useState({
    firstname: "",
    lastname: "",
    email: "",
    number: "",
    position: "",
    isEmployee: "",
  });

  const { state } = useContext(Store);
  const { employeeInfo } = state;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`/api/employee/getEmployeeId/${id}`, {
          headers: { Authorization: `Bearer ${employeeInfo.token}` },
        });
        setSeeEmployee(data);
       
      } catch (err) {
        toast.error(getError(err));
      }
    };
    fetchData();
  }, [id, employeeInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setisUpdating(true);
    try {
      const { data } = await axios.patch(
        `/api/employee/updateEmployeeById/${id}`,
        {
          firstname: seeEmployee.firstname,
          lastname: seeEmployee.lastname,
          email: seeEmployee.email,
          number: seeEmployee.number,
          position: seeEmployee.position,
          isEmployee: seeEmployee.isEmployee,
        },
        {
          headers: { Authorization: `Bearer ${employeeInfo.token}` },
        }
      );

      if (data) {
        navigate("/employees");
      }
    } catch (err) {
      toast.error(getError(err));
      console.log(err);
    }
  };

  return (
    <div>
      <NavbarComp color="dark" />
      <Container className="small-container">
        <Helmet>
          <title>Update Employee</title>
        </Helmet>
        <h1 className="my-3">Update Employee</h1>
        <Form onSubmit={submitHandler}>
          <Form.Group className="mb-3" controlId="firstname">
            <Form.Label>FirstName</Form.Label>
            <Form.Control
              type="firstname"
              value={seeEmployee.firstname}
              required
              onChange={(e) =>
                setSeeEmployee({
                  firstname: e.target.value,
                  lastname: seeEmployee.lastname,
                  email: seeEmployee.email,
                  number: seeEmployee.number,
                  position: seeEmployee.position,
                  isEmployee: seeEmployee.isEmployee,
                })
              }
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="lastname">
            <Form.Label>Lastname</Form.Label>
            <Form.Control
              type="lastname"
              value={seeEmployee.lastname}
              required
              onChange={(e) =>
                setSeeEmployee({
                  firstname: seeEmployee.firstname,
                  lastname: e.target.value,
                  email: seeEmployee.email,
                  number: seeEmployee.number,
                  position: seeEmployee.position,
                  isEmployee: seeEmployee.isEmployee,
                })
              }
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={seeEmployee.email}
              required
              onChange={(e) =>
                setSeeEmployee({
                  firstname: seeEmployee.firstname,
                  lastname: seeEmployee.lastname,
                  email: e.target.value,
                  number: seeEmployee.number,
                  position: seeEmployee.position,
                  isEmployee: seeEmployee.isEmployee,
                })
              }
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="number">
            <Form.Label>Number</Form.Label>
            <Form.Control
              type="number"
              value={seeEmployee.number}
              required
              onChange={(e) =>
                setSeeEmployee({
                  firstname: seeEmployee.firstname,
                  lastname: seeEmployee.lastname,
                  email: seeEmployee.email,
                  number: e.target.value,
                  position: seeEmployee.position,
                  isEmployee: seeEmployee.isEmployee,
                })
              }
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
                checked={type === seeEmployee.position}
                onChange={() =>
                  setSeeEmployee({
                    firstname: seeEmployee.firstname,
                    lastname: seeEmployee.lastname,
                    email: seeEmployee.email,
                    number: seeEmployee.number,
                    position: type,
                    isEmployee: seeEmployee.isEmployee,
                  })
                }
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
                checked={type === seeEmployee.isEmployee}
                onChange={() =>
                  setSeeEmployee({
                    firstname: seeEmployee.firstname,
                    lastname: seeEmployee.lastname,
                    email: seeEmployee.email,
                    number: seeEmployee.number,
                    position: seeEmployee.position,
                    isEmployee: type,
                  })
                }
              />
            ))}
          </Form.Group>

          {isUpdating ? (
            <div className="mb-3 mt-5">
              <Button type="submit" disabled>
                Updating...
              </Button>
            </div>
          ) : (
            <div className="mb-3 mt-5">
              <Button type="submit">Update Employee</Button>
            </div>
          )}
        </Form>
      </Container>
    </div>
  );
}
