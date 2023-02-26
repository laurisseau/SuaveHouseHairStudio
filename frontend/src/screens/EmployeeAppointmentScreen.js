import React, { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import axios from "axios";
import NavbarComp from "../components/NavbarComp";
import { Store } from "../Store";
import Container from "react-bootstrap/esm/Container";
import LoadingBoxComp from "../components/LoadingBoxComp";
import AppointmentInfoComp from "../components/AppointmentInfoComp";
import Table from "react-bootstrap/Table";

export default function EmployeeAppointmentScreen() {


  const { state } = useContext(Store);
  const { employeeInfo } = state;
  const [seeAppointments, SetSeeAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          "/api/appointment/getEmployeeAppointment",
          {
            headers: { Authorization: `Bearer ${employeeInfo.token}` },
          }
        );
        SetSeeAppointments(data);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [employeeInfo]);

  return (
    <div>
      <NavbarComp color="dark" />
      <Container>
        <Helmet>
          <title>Appointments</title>
        </Helmet>

        <h1 className="mt-4">Appointments</h1>
        {loading ? (
          <LoadingBoxComp />
        ) : (
        <Table className="table" responsive>
          <thead>
            <tr>
              <th>User</th>
              <th>NUMBER</th>
              <th>DATE</th>
              <th>TIME</th>
              <th>PAID</th>
              <th>PRICE</th>
            </tr>
          </thead>
          <tbody>
            {seeAppointments.map((info) => (
              <AppointmentInfoComp key={info._id} info={info} />
            ))}
          </tbody>
        </Table>
         )}
      </Container>
    </div>
  );
}
