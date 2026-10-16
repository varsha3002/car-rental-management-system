
import { useEffect, useState } from "react";

function MyBookings({ customer }) {
  const [rentals, setRentals] = useState([]);
  const [cars, setCars] = useState([]);
  const [payments, setPayments] = useState([]);
  const [message, setMessage] = useState("Loading bookings...");

  useEffect(() => {
    if (!customer) {
      setRentals([]);
      setCars([]);
      setPayments([]);
      setMessage("Please login to view your bookings.");
      return;
    }

    setMessage("Loading bookings...");

    Promise.all([
      fetch(
        `http://localhost:8080/rentals/customer/${customer.customerID}`
      ).then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch bookings");
        }
        return response.json();
      }),

      fetch("http://localhost:8080/cars").then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch cars");
        }
        return response.json();
      }),

      fetch("http://localhost:8080/payments").then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch payments");
        }
        return response.json();
      }),
    ])
      .then(([rentalData, carData, paymentData]) => {
        setRentals(rentalData);
        setCars(carData);
        setPayments(paymentData);

        setMessage(
          rentalData.length === 0
            ? "You have no bookings yet."
            : ""
        );
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setMessage("Unable to load bookings. Please try again.");
      });
  }, [customer]);

  return (
    <div className="cars-page">
      <div className="cars-header">
        <h1>My Bookings</h1>
        <p>View your car rental and payment history.</p>
      </div>

      {message && (
        <p style={{ textAlign: "center" }}>{message}</p>
      )}

      <div className="car-list">
        {rentals.map((rental) => {
          const car = cars.find(
            (item) => item.carId === rental.carID
          );

          const payment = payments.find(
            (item) => item.rentalID === rental.rentalID
          );

          return (
            <div className="car-card" key={rental.rentalID}>
              <div className="car-icon">🚗</div>

              <h2>Booking #{rental.rentalID}</h2>

              <h3>
                {car
                  ? `${car.brand} ${car.model}`
                  : `Car ID: ${rental.carID}`}
              </h3>

              {car && <p>Year: {car.year}</p>}

              <p>Customer ID: {rental.customerID}</p>
              <p>Rental Date: {rental.rentalDate}</p>
              <p>Return Date: {rental.returnDate}</p>

              <hr />

              <h3>Booking Status</h3>

              <p
                style={{
                  color: payment ? "green" : "red",
                  fontWeight: "bold",
                }}
              >
                {payment ? "Confirmed" : "Payment Pending"}
              </p>

              <h3>Payment Details</h3>

              {payment ? (
                <>
                  <p>Amount: ₹{payment.amount}</p>
                  <p>Payment Date: {payment.paymentDate}</p>
                  <p>Payment Method: {payment.paymentMethod}</p>
                </>
              ) : (
                <p>Payment not recorded.</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MyBookings;
