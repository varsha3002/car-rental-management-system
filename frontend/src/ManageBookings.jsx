
import { useEffect, useState } from "react";

function ManageBookings() {
  const [rentals, setRentals] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [cars, setCars] = useState([]);
  const [payments, setPayments] = useState([]);
  const [message, setMessage] = useState("Loading bookings...");

  useEffect(() => {
    Promise.all([
      fetch("http://localhost:8080/rentals").then((res) => {
        if (!res.ok) throw new Error("Failed to load rentals");
        return res.json();
      }),
      fetch("http://localhost:8080/customers").then((res) => {
        if (!res.ok) throw new Error("Failed to load customers");
        return res.json();
      }),
      fetch("http://localhost:8080/cars").then((res) => {
        if (!res.ok) throw new Error("Failed to load cars");
        return res.json();
      }),
      fetch("http://localhost:8080/payments").then((res) => {
        if (!res.ok) throw new Error("Failed to load payments");
        return res.json();
      }),
    ])
      .then(([rentalData, customerData, carData, paymentData]) => {
        setRentals(rentalData);
        setCustomers(customerData);
        setCars(carData);
        setPayments(paymentData);
        setMessage(
          rentalData.length === 0 ? "No bookings available." : ""
        );
      })
      .catch((error) => {
        console.error("Error loading bookings:", error);
        setMessage("Unable to load bookings.");
      });
  }, []);

  return (
    <div className="cars-page">
      <div className="cars-header">
        <h1>Manage Bookings</h1>
        <p>View all customer car rentals and payment status.</p>
      </div>

      {message && (
        <p style={{ textAlign: "center" }}>{message}</p>
      )}

      {!message && (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Rental ID</th>
                <th>Customer</th>
                <th>Car</th>
                <th>Rental Date</th>
                <th>Return Date</th>
                <th>Payment Status</th>
                <th>Amount</th>
              </tr>
            </thead>

            <tbody>
              {rentals.map((rental) => {
                const customer = customers.find(
                  (item) =>
                    item.customerID === rental.customerID
                );

                const car = cars.find(
                  (item) => item.carId === rental.carID
                );

                const payment = payments.find(
                  (item) => item.rentalID === rental.rentalID
                );

                return (
                  <tr key={rental.rentalID}>
                    <td>{rental.rentalID}</td>

                    <td>
                      {customer
                        ? `${customer.name} (ID: ${customer.customerID})`
                        : `ID: ${rental.customerID}`}
                    </td>

                    <td>
                      {car
                        ? `${car.brand} ${car.model}`
                        : `ID: ${rental.carID}`}
                    </td>

                    <td>{rental.rentalDate}</td>
                    <td>{rental.returnDate}</td>

                    <td
                      style={{
                        color: payment ? "green" : "#dc2626",
                        fontWeight: "bold",
                      }}
                    >
                      {payment ? "Paid" : "Payment Pending"}
                    </td>

                    <td>
                      {payment
                        ? `₹${payment.amount}`
                        : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ManageBookings;
