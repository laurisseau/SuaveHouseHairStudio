import { useState } from "react";
import axios from "axios";
import { useStripe, useElements } from "@stripe/react-stripe-js";
import { PaymentElement } from "@stripe/react-stripe-js";
import Button from "react-bootstrap/Button";
import { useParams } from "react-router-dom";

export default function PaymentForm() {
  const params = useParams();
  const { id } = params;

  const [isProcessing, setIsProcessing] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: "",
      },
      redirect: "if_required",
    });

    if (error) {
      console.log(error);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      const { data } = await axios.put(
        `/api/appointment/updatePaidAppointment/${id}`
      );

      if (data) {

        

        window.location.href = "/appointments"
      }
    }
    setIsProcessing(false);
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <PaymentElement />

      {isProcessing ? (
        <Button className="w-100 mt-4 p-2" disabled>
          Processing...
        </Button>
      ) : (
        <Button type="submit" className="w-100 mt-4 p-2">
          Pay
        </Button>
      )}
    </form>
  );
}
