import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";

function PaymentPage() {
  const { rentalId } = useParams();
  const navigate = useNavigate();

  const stripe = useStripe();
  const elements = useElements();

  const [clientSecret, setClientSecret] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`http://localhost:8080/api/payments/create/${rentalId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => setClientSecret(res.data))
      .catch(() => setError("Failed to load payment information"));
  }, [rentalId]);

  const handlePayment = async () => {
    if (!stripe || !elements) return;

    setLoading(true);
    setError("");

    const cardElement = elements.getElement(CardElement);

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
      },
    });

    if (result.error) {
      setError(result.error.message);
      setLoading(false);
      return;
    }

    if (result.paymentIntent.status === "succeeded") {
      await fetch(`http://localhost:8080/api/rentals/${rentalId}/status`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "ACTIVE" }),
      });

      navigate("/my-rentals");
    }

    setLoading(false);
  };

  if (!clientSecret) {
    return (
      <div className="payment-page">
        <div className="payment-loading">Loading payment session...</div>
      </div>
    );
  }

  return (
    <div className="payment-page">
      <div className="payment-container">
        <h2 className="payment-title">Payment</h2>
        <p className="payment-subtitle">
          Enter your card details to complete the payment
        </p>

        <div className="payment-card-container">
          <CardElement
            options={{
              hidePostalCode: true,
              style: {
                base: {
                  fontSize: "16px",
                  color: "#f5f7ff",
                  fontFamily: "Montserrat, Roboto, system-ui, sans-serif",
                  "::placeholder": {
                    color: "#8b93a7",
                  },
                },
                invalid: {
                  color: "#dc3545",
                  iconColor: "#dc3545",
                },
                complete: {
                  color: "#3ecf8e",
                  iconColor: "#3ecf8e",
                },
              },
            }}
          />
        </div>

        {error && <div className="payment-error">{error}</div>}

        <button
          onClick={handlePayment}
          disabled={loading || !stripe || !elements}
          className="payment-button"
        >
          {loading ? "Processing..." : "Pay Now"}
        </button>
      </div>
    </div>
  );
}

export default PaymentPage;
