import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js"

function PaymentPage() {
  const { rentalId } = useParams()
  const navigate = useNavigate()

  const stripe = useStripe()
  const elements = useElements()

  const [clientSecret, setClientSecret] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    fetch(`http://localhost:8080/api/payments/create/${rentalId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(res => setClientSecret(res.data))
      .catch(() => setError("Failed to load payment information"))
  }, [rentalId])

  const handlePayment = async () => {
    if (!stripe || !elements) return

    setLoading(true)
    setError("")

    const cardElement = elements.getElement(CardElement)

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement
      }
    })

    if (result.error) {
      setError(result.error.message)
      setLoading(false)
      return
    }

    if (result.paymentIntent.status === "succeeded") {
      await fetch(`http://localhost:8080/api/rentals/${rentalId}/status`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ status: "ACTIVE" })
      })

      navigate("/my-rentals")
    }

    setLoading(false)
  }

  if (!clientSecret) {
    return <div style={{ padding: 20 }}>Loading payment session...</div>
  }

  return (
    <div style={{ maxWidth: 420, margin: "40px auto" }}>
      <h2>Payment</h2>

      <div style={{ padding: 20, border: "1px solid #ccc", borderRadius: 8 }}>
        <CardElement options={{ hidePostalCode: true }} />
      </div>

      {error && <p style={{ color: "red", marginTop: 12 }}>{error}</p>}

      <button
        onClick={handlePayment}
        disabled={loading}
        style={{
          width: "100%",
          padding: "12px 0",
          marginTop: 20,
          backgroundColor: "#4A90E2",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          cursor: "pointer"
        }}
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </div>
  )
}

export default PaymentPage
