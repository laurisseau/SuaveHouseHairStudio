import { useEffect, useContext, useState } from "react";
import { Store } from "../Store";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import PaymentForm from "../components/PaymentForm";
import { useParams } from "react-router-dom";
import LoadingBoxComp from "../components/LoadingBoxComp";
import Container from "react-bootstrap/esm/Container";

export default function PaymentScreen() {
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const { id } = params;
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [clientData, setClientData] = useState("");
  const [publishableKey, setPublishableKey] = useState("123");

  useEffect(() => {
    const fetchData2 = async () => {
      try {
        const { data } = await axios.get(
          `/api/appointment/getAppointment/${id}`,
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        setPublishableKey(data.employee.publishableKey);
        setClientData(data.clientSecret);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData2();
  }, [id, userInfo]);

  const stripePromise = loadStripe(publishableKey);

  return (
    <Container className="padding-vh-25 vh-100">
      {stripePromise && clientData && (
        <Elements options={{ clientSecret: clientData }} stripe={stripePromise}>
          {loading ? <LoadingBoxComp /> : <PaymentForm />}
        </Elements>
      )}
    </Container>
  );
}
