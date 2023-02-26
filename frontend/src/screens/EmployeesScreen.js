import React, { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import axios from "axios";
import Table from "react-bootstrap/Table";
import NavbarComp from "../components/NavbarComp";
import { Link } from "react-router-dom";
import { Store } from "../Store";
import Container from "react-bootstrap/esm/Container";
import LoadingBoxComp from "../components/LoadingBoxComp";
import { toast } from "react-toastify";
import { getError } from "../utils";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";

export default function EmployeesScreen() {
  const { state } = useContext(Store);
  const { employeeInfo } = state;
  const [seeEmployees, SetSeeEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState([false, ""]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get("/api/employee/getEmployee", {
          headers: { Authorization: `Bearer ${employeeInfo.token}` },
        });

        SetSeeEmployees(data);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [employeeInfo]);

  const deleteEmployee = async (id) => {
    setAlert([false, ""]);
    setLoading(true);

    try {
      const { data } = await axios.delete(
        `/api/employee/deleteEmployeeById/${id}`,
        {
          headers: { Authorization: `Bearer ${employeeInfo.token}` },
        }
      );
      if (data) {
        const { data } = await axios.get("/api/employee/getEmployee", {
          headers: { Authorization: `Bearer ${employeeInfo.token}` },
        });

        SetSeeEmployees(data);
      }

      setLoading(false);
    } catch (err) {
      toast.error(getError(err));
    }
  };

  function AlertDismissible() {
    return (
      <>
        <Alert show={alert[0]} variant="danger">
          <Alert.Heading>
            Are you sure you sant to delete this employee?
          </Alert.Heading>

          <Button
            className="mt-3"
            onClick={() => deleteEmployee(alert[1])}
            variant="outline-danger"
          >
            Yes
          </Button>
          <Button
            className="mt-3 ms-3"
            onClick={() => setAlert([false, ""])}
            variant="outline-danger"
          >
            No
          </Button>
        </Alert>
      </>
    );
  }

  return (
    <div>
      <NavbarComp color="dark" />
      <Container>
        <Helmet>
          <title>Employee's</title>
        </Helmet>

        <h1 className="mt-4">Employee's</h1>
        <AlertDismissible />
        {loading ? (
          <LoadingBoxComp />
        ) : (
          <Table className="table mb-0" responsive>
            <thead>
              <tr>
                <th>EMPLOYEE</th>
                <th>EMAIL</th>
                <th>NUMBER</th>
                <th>POSITION</th>
                <th>ROLE</th>
                <th>EDIT</th>
              </tr>
            </thead>
            <tbody>
              {seeEmployees.map((info) => (
                <tr key={info._id}>
                  <td>{`${info.firstname}  ${info.lastname}`}</td>
                  <td>{`${info.email}`}</td>
                  <td>{`${info.number}`}</td>
                  <td>{info.position}</td>
                  <td>{info.isEmployee}</td>
                  <td>
                    <span
                      className="material-symbols-outlined text-danger "
                      role="button"
                      onClick={() => {
                        setAlert([true, info._id]);

                        //deleteEmployee(info._id);
                      }}
                    >
                      delete
                    </span>

                    <Link to={`/updateEmployee/${info._id}`}>
                      <span className="material-symbols-outlined">
                        edit_square
                      </span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}

        <Link to="/createEmployee" className="text-secondary">
          <div className="background-hover-color text-center  pb-1 pt-2">
            <span className="material-symbols-outlined">add</span>
          </div>
        </Link>
      </Container>
    </div>
  );
}
