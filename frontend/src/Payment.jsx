
import { useState } from "react";

function Payment({ rentalId, amount }) {
  const [paymentDate, setPaymentDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [message, setMessage] = useState("");
  const [showQR, setShowQR] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);

  const handleShowQR = (event) => {
    event.preventDefault();
    setMessage("");

    if (!paymentDate) {
      setMessage("Please select a payment date.");
      return;
    }

    if (!amount || Number(amount) <= 0) {
      setMessage("The booking amount is unavailable. Please check your booking.");
      return;
    }

    if (paymentMethod === "UPI") {
      setShowQR(true);
    } else {
      handleDemoPayment();
    }
  };

  const handleDemoPayment = () => {
    const payment = {
      rentalID: Number(rentalId),
      amount: Number(amount),
      paymentDate,
      paymentMethod,
    };

    fetch("http://localhost:8080/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payment),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Unable to save demo payment");
        }
        return response.json();
      })
      .then(() => {
        setMessage("Demo payment recorded. No real money was transferred.");
        setPaymentDone(true);
        setShowQR(false);
      })
      .catch((error) => {
        console.error("Payment error:", error);
        setMessage("Unable to save the demo payment. Please try again.");
      });
  };

  if (paymentDone) {
    return (
      <div className="payment-page">
        <div className="payment-card">
          <div style={{ fontSize: "55px" }}>✅</div>
          <h1>Demo Payment Successful!</h1>

          <p>
            This is a project simulation. No real money was transferred.
          </p>

          <div className="payment-rental">
            <p>Rental ID</p>
            <h2>{rentalId}</h2>

            <p>Amount</p>
            <h2>₹{Number(amount).toLocaleString("en-IN")}</h2>

            <p>Payment Method: {paymentMethod}</p>
            <p>Payment Date: {paymentDate}</p>
          </div>

          <button onClick={() => (window.location.href = "/")}>
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-page">
      <div className="payment-card">
        <h1>Make Payment</h1>

        <p
          style={{
            background: "#fff7ed",
            color: "#9a3412",
            padding: "12px",
            borderRadius: "8px",
            fontSize: "14px",
          }}
        >
          DEMO MODE: This screen simulates payment for your project.
          It does not transfer real money.
        </p>

        <div className="payment-rental">
          <p>Rental ID</p>
          <h2>{rentalId}</h2>

          <p>Booking Amount</p>
          <h2>₹{Number(amount).toLocaleString("en-IN")}</h2>
        </div>

        <form className="payment-form" onSubmit={handleShowQR}>
          <label>Payment Date</label>

          <input
            type="date"
            value={paymentDate}
            onChange={(event) => setPaymentDate(event.target.value)}
            required
          />

          <label>Payment Method</label>

          <select
            value={paymentMethod}
            onChange={(event) => {
              setPaymentMethod(event.target.value);
              setShowQR(false);
            }}
          >
            <option value="UPI">UPI QR Code (Demo)</option>
            <option value="Card">Card (Demo)</option>
            <option value="Cash">Cash (Demo)</option>
          </select>

          <button type="submit">
            {paymentMethod === "UPI"
              ? "Show Demo QR Code"
              : "Simulate Payment"}
          </button>
        </form>

        {message && (
          <p style={{ color: "#b91c1c" }}>{message}</p>
        )}

        {showQR && (
          <div
            style={{
              marginTop: "25px",
              padding: "20px",
              background: "#f8fafc",
              borderRadius: "12px",
              textAlign: "center",
            }}
          >
            <h2>Demo QR Code</h2>

            <p>
              This is a placeholder graphic, not a scannable payment QR code.
            </p>

            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "190px",
                height: "190px",
                background: "white",
                border: "2px dashed #64748b",
                borderRadius: "8px",
                fontSize: "70px",
              }}
            >
              ▦
            </div>

            <h3>
              Amount: ₹{Number(amount).toLocaleString("en-IN")}
            </h3>

            <button type="button" onClick={handleDemoPayment}>
              Simulate Successful Payment
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Payment;
