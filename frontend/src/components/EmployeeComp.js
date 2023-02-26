import { useState, useContext } from "react";
//import axios from 'axios';
//import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import ModalComp from "./ModalComp";
import { Store } from "../Store";
import { Link } from "react-router-dom";

export default function EmployeeComp(x) {
  const [modalShow, setModalShow] = useState(false);
  const { state } = useContext(Store);

  return (
    <div>
      <Card className="mt-4 mb-5">
        <Card.Img variant="top" src={require(`../img/${x.x.image}`)} />
        <Card.ImgOverlay className="d-flex align-items-end">
          <div className="employee-info" style={{ color: "white" }}>
            <h4>{`${x.x.firstname} ${x.x.lastname}`}</h4>
            <h5>Professional Barber</h5>
            {!state.userInfo ? (
              <Button variant="primary" className="employee-button">
                <Link className="nav-link" to="/signin">
                  Book
                </Link>
              </Button>
            ) : (
              <Button
                style={{ width: "6rem" }}
                className="employee-button"
                onClick={() => setModalShow(true)}
                variant="primary"
              >
                Book
              </Button>
            )}
          </div>
        </Card.ImgOverlay>
      </Card>

      <ModalComp
        show={modalShow}
        onHide={() => setModalShow(false)}
        dialogClassName="modal-90w"
        id={x.x}
      />
    </div>
  );
}
