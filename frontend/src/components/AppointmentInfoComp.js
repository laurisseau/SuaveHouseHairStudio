//import React from "react";
import { Store } from "../Store";
import { Link } from "react-router-dom";
import React, { useContext } from "react";

export default function AppointmentInfoComp({ info }) {
  const { state } = useContext(Store);

  const last2 = (price) => {
    const str = price.toString();
    return str.slice(0, str.length - 2);
  };

  if (state.employeeInfo) {
    return (
      <tr key={info._id}>
        <td>{`${info.user.firstname} ${info.user.lastname}`}</td>
        <td>{info.user.number}</td>
        <td>{`${info.month} ${info.day}`}</td>
        <td>{info.time}</td>
        <td className="nl">
          {info.paid === "Paid" ? (
            <span>{info.paid}</span>
          ) : (
            <span className={info.clientSecret ? "" : "pay-in-person"}>
              {info.clientSecret ? info.paid : info.paymentMethod}
            </span>
          )}
        </td>
        <td>${last2(info.cutPrice)}.00</td>
      </tr>
    );
  } else if (state.userInfo) {
    //console.log(info)
    if (info.employee === null) {
      info.employee = { firstname: "Not", lastname: "Working" };
    }
    return (
      <tr key={info._id}>
        <td>{`${info.employee.firstname} ${info.employee.lastname}`}</td>
        <td>{`${info.month} ${info.day}`}</td>
        <td>{info.time}</td>
        <td className="nl">
          {info.paid === "Paid" ? (
            <span>{info.paid}</span>
          ) : (
            <Link
              className={info.clientSecret ? "" : "pay-in-person"}
              to={`/paymentScreen/${info._id}`}
            >
              {info.clientSecret ? info.paid : info.paymentMethod}
            </Link>
          )}
        </td>
        <td>${last2(info.cutPrice)}.00</td>
      </tr>
    );
  }
}
