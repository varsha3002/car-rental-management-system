
import { useState } from "react";
import Payment from "./Payment";

function Booking({ car, customer }) {
  const [rentalDate, setRentalDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [rentalId, setRentalId] = useState(null);
  const [bookingAmount, setBookingAmount] = useState(0);
  const [message, setMessage] = useState("");

  // Read the daily price from the car returned by the backend.
  const pricePerDay = Number(
    car.pricePerDay ??
    car.priceperday ??
    car.price_per_day ??
    0
  );

  const getRentalDays = () => {
    if (!rentalDate || !returnDate) {
      return 0;
    }

    // Parse date-only values consistently without timezone shifts.
    const start = new Date(`${rentalDate}T00:00:00Z`);
    const end = new Date(`${returnDate}T00:00:00Z`);

    const difference = end.getTime() - start.getTime();

    return Math.round(difference / (1000 * 60 * 60 * 24));
  };

  const rentalDays = getRentalDays();

  const calculateAmount = () => {
    if (
      !Number.isFinite(pricePerDay) ||
      pricePerDay <= 0 ||
      rentalDays <= 0
    ) {
      return 0;
    }

    return pricePerDay * rentalDays;
  };

  const estimatedAmount = calculateAmount();

  const handleBooking = () => {
    setMessage("");

    if (!customer) {
      setMessage("Please log in before booking.");
      return;
    }

    if (!rentalDate || !returnDate) {
      setMessage("Please select rental and return dates.");
      return;
    }

    if (rentalDays <= 0) {
      setMessage("Return date must be after the rental date.");
      return;
    }

    if (!Number.isFinite(pricePerDay) || pricePerDay <= 0) {
      setMessage(
        "Car price is unavailable. Please check the car price in the backend."
      );
      return;
    }

    const rental = {
      customerID: customer.customerID,
      carID: car.carId,
      rentalDate: rentalDate,
      returnDate: returnDate,
    };

    fetch("http://localhost:8080/rentals", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(rental),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Booking failed");
        }

        return response.json();
      })
      .then((data) => {
        if (!data.rentalID) {
          throw new Error("Rental ID was not returned by the backend");
        }

        setBookingAmount(estimatedAmount);
        setRentalId(data.rentalID);
      })
      .catch((error) => {
        console.error("Booking error:", error);
        setMessage("Booking failed. Please try again.");
      });
  };

  if (rentalId !== null) {
    return (
      <Payment
        rentalId={rentalId}
        amount={bookingAmount}
        onBack={() => setRentalId(null)}
      />
    );
  }

  return (
    <div className="booking-page">
      <div className="booking-card">
        <h1>Book Your Car</h1>

        <div className="selected-car">
          <div className="booking-car-icon">🚗</div>

          <h2>
            {car.brand} {car.model}
          </h2>

          <p>Year: {car.year}</p>

          <p>
            Price per day:{" "}
            {pricePerDay > 0
              ? `₹${pricePerDay.toLocaleString("en-IN")}`
              : "Price unavailable"}
          </p>
        </div>

        <div className="booking-form">
          <label>Customer</label>

          <input
            type="text"
            value={`${customer.name} (ID: ${customer.customerID})`}
            readOnly
          />

          <label>Rental Date</label>

          <input
            type="date"
            value={rentalDate}
            min={new Date().toLocaleDateString("en-CA")}
            onChange={(event) => setRentalDate(event.target.value)}
            required
          />

          <label>Return Date</label>

          <input
            type="date"
            value={returnDate}
            min={rentalDate || new Date().toLocaleDateString("en-CA")}
            onChange={(event) => setReturnDate(event.target.value)}
            required
          />

          <div className="selected-car">
            <h3>Estimated Total</h3>

            <h2>
              ₹{estimatedAmount.toLocaleString("en-IN")}
            </h2>

            <p>
              {rentalDays > 0
                ? `${rentalDays} rental day(s) × ₹${pricePerDay.toLocaleString("en-IN")} per day`
                : "Select valid rental and return dates"}
            </p>
          </div>

          <button onClick={handleBooking}>
            Confirm Booking
          </button>
        </div>

        {message && (
          <p style={{ color: "#b91c1c" }}>{message}</p>
        )}
      </div>
    </div>
  );
}

export default Booking;
