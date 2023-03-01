import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Button from "react-bootstrap/Button";
import { Store } from "../Store";
import { useNavigate } from "react-router-dom";
import LoadingBoxComp from "../components/LoadingBoxComp";
import Table from "react-bootstrap/Table";
import { toast } from "react-toastify";
import { getError } from "../utils";

export default function ModalComp(props) {
  const [loading, setLoading] = useState(false);

  const last2 = (price) => {
    const str = price.toString();
    return str.slice(0, str.length - 2);
  };

  const navigate = useNavigate();

  const cutType = {
    hairCuts: [
      { cutType: "Men Haircut & Beard", price: 3000 },
      {
        cutType: "Kids Cuts(under 12 years old)",
        price: 2000,
      },
      {
        cutType: "Men Haircut/eyebrows(No Facial)",
        price: 2500,
      },
      {
        cutType: "Eyebrows",
        price: 500,
      },
      {
        cutType: "Shape Up & Beard",
        price: 1800,
      },
      {
        cutType: "Shape Up(No Facial)",
        price: 1000,
      },
    ],
  };

  const { state } = useContext(Store);

  // sv === scheduleValues

  let sv = Object.values(props.id.schedule);
  const employee = props.id._id;
  const employeeKey = props.id.key;
  const employeeIv = props.id.iv;
  const user = !state.userInfo ? null : state.userInfo._id;

  let firstObj = sv[0];
  const [cutName, setCutName] = useState("");
  const [cutPrice, setCutPrice] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [num, setNum] = useState(0);
  const [time, setTime] = useState("");
  const [day, setDay] = useState(Object.values(firstObj)[1]);
  const [month, setMonth] = useState(Object.values(firstObj)[2]);
  const [dayName, setDayName] = useState(Object.keys(firstObj)[0]);
  const [scheduleObj, setScheduleObj] = useState(sv);

  const numObj = scheduleObj[num];

  const timeArr = numObj[dayName];

  useEffect(() => {
    setTime("");
  }, [num]);

  const createAppointmentFunc = async (clientSecret, paymentMethod) => {
    try {
      const { data } = await axios.post("/api/appointment/createAppointment", {
        employee,
        user,
        time,
        day,
        dayName,
        month,
        paymentMethod,
        cutName,
        cutPrice,
        clientSecret,
      });

      if (paymentMethod === "Pay now") {
        navigate(`/paymentScreen/${data._id}`);
      } else {
        navigate(`/appointments`);
      }

      setScheduleObj(data.employee.schedule);
    } catch (err) {
      toast.error(getError(err));
      setLoading(false);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      if (paymentMethod === "Pay now") {
        const clientData = await axios.post("api/create-payment-intent", {
          amount: cutPrice,
          id: employee,
          key: employeeKey,
          iv: employeeIv,
        });

        const clientSecret = clientData.data.clientSecret;

        createAppointmentFunc(clientSecret, paymentMethod);
      } else {
        createAppointmentFunc("", paymentMethod);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const timePeriod = props.id.schedule.length;
  let numOfCards = [];

  for (let i = 0; i < timePeriod; i++) {
    const dayn = Object.keys(sv[i]);

    numOfCards.push(
      <Card
        key={i}
        style={{ width: "4rem" }}
        className={num === i ? "border-color text-center" : "text-center"}
        onClick={() => {
          setDayName(dayn[0]);
          setDay(sv[i].day);
          setMonth(sv[i].month);
          setNum(i);
          //console.log(dayn[0], sv[i].day, sv[i].month);
        }}
      >
        <p>{dayn[0]}</p>
        <p>{sv[i].day}</p>
      </Card>
    );
  }

  const responsiveCarousel = {
    all: {
      breakpoint: { max: 4000, min: 0 },
      items: 1,
    },
  };

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 8,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 6,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 3,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 2,
    },
  };

  const responsiveTime = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 6,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 4,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  let [current, setCurrent] = useState(0);
  const length = 2;

  const nextSlide = () => {
    setCurrent(current === length ? 0 : (current = current + 1));
  };

  const prevSlide = () => {
    setCurrent(current === 0 ? 0 : (current = current - 1));
  };

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <form onSubmit={submitHandler}>
        <Modal.Header className="ps-5 pe-5" closeButton>
          <Button variant="" onClick={prevSlide}>
            <i className="fas fa-chevron-left"></i>
          </Button>
        </Modal.Header>

        <Carousel
          arrows={false}
          responsive={responsiveCarousel}
          swipeable={false}
          draggable={false}
        >
          <Modal.Body
            className={
              current === 0
                ? "o active pt-4 ps-4 pe-4 pb-5"
                : "no active pt-4 ps-4 pe-4 pb-5"
            }
          >
            <Table className="table mb-0 " responsive>
              <thead>
                <tr>
                  <th></th>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {cutType.hairCuts.map((obj, id) => (
                  <tr key={id}>
                    <td>{`${obj.cutType}`}</td>
                    <td className="align-middle">{`$${last2(
                      obj.price
                    )}.00`}</td>

                    <td className="align-middle">
                      <Button
                        className="ms-2 me-2 "
                        onClick={() => {
                          setCurrent(
                            current === length ? 0 : (current = current + 1)
                          );
                          setCutName(obj.cutType);
                          setCutPrice(obj.price);
                        }}
                      >
                        Book
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Modal.Body>

          <Modal.Body
            className={
              current === 1
                ? "o active2 pt-4 ps-5 pe-5 pb-5"
                : " no active2 pt-4 ps-5 pe-5 pb-5"
            }
          >
            <h1 className="text-center pb-3">Make an appointment</h1>

            <Carousel
              className="pb-3 border-bottom"
              centerMode={true}
              responsive={responsive}
            >
              {numOfCards}
            </Carousel>

            <h1 className="text-center mt-2">Pick a Time</h1>

            <Carousel
              className="mt-4 mb-4"
              centerMode={true}
              responsive={responsiveTime}
            >
              {timeArr.map((mapTime, timeNum) => (
                <Card
                  key={timeNum}
                  className={
                    time === mapTime
                      ? "border-color text-center pick-time"
                      : "text-center pick-time"
                  }
                  onClick={(e) => {
                    setTime(e.target.innerText);
                  }}
                >
                  <p className="m-2">{mapTime}</p>
                </Card>
              ))}
            </Carousel>

            <Table className="p-3 ">
              <tbody>
                <tr>
                  <td>
                    <h4>{cutName}</h4>
                  </td>
                  <td>
                    <h4>${last2(cutPrice)}.00</h4>
                  </td>
                </tr>
              </tbody>
            </Table>

            <Button
              onClick={nextSlide}
              className={time ? "border-color w-100 p-2" : "none"}
            >
              Next
            </Button>
          </Modal.Body>

          <Modal.Body
            className={
              current === 2
                ? "o active3 pt-4 ps-5 pe-5 pb-5"
                : "no active3 pt-4 ps-5 pe-5 pb-5"
            }
          >
            {["Pay now", "Pay in person"].map((type) => (
              <Form.Check
                key={type}
                className="pt-4 ps-5 pe-5"
                type="radio"
                name="payment-type"
                label={type}
                id={type}
                onChange={() => {
                  setPaymentMethod(type);
                }}
              />
            ))}

            {loading ? (
              <Button
                className="border-color w-100 p-2 mt-5"
                type="submit"
                disabled
              >
                <LoadingBoxComp />
              </Button>
            ) : (
              <Button className="border-color w-100 p-2 mt-5" type="submit">
                Submit
              </Button>
            )}
          </Modal.Body>
        </Carousel>
      </form>
    </Modal>
  );
}

/*

<div className="cut-type">
              {cutType.hairCuts.map((obj, id) => (
                <div
                  key={id}
                  className="d-flex justify-content-between border-bottom pb-2 pt-2"
                >
                  <div className="mb-0 mt-2">{obj.cutType}</div>

                  <div className="d-flex">
                    <p className="mb-0 mt-2 ">${last2(obj.price)}.00</p>
                    <Button
                      className="ms-2 me-2"
                      onClick={() => {
                        setCurrent(
                          current === length ? 0 : (current = current + 1)
                        );
                        setCutName(obj.cutType);
                        setCutPrice(obj.price);
                      }}
                    >
                      Book
                    </Button>
                  </div>
                </div>
              ))}


                      <Card.Header className="p-3 ">
              <div className="d-flex justify-content-between">
                <div>
                  <h4>{cutName}</h4>
                </div>

                <div>
                  <h4>${last2(cutPrice)}.00</h4>
                </div>
              </div>
            </Card.Header>    

*/
