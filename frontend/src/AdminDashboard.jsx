
import { useEffect, useState } from "react";

function AdminDashboard({ setPage }) {
  const [cars, setCars] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [rentals, setRentals] = useState([]);
  const [payments, setPayments] = useState([]);
  const [message, setMessage] = useState("Loading dashboard...");

  useEffect(() => {
    Promise.all([
      fetch("http://localhost:8080/cars").then((res) => {
        if (!res.ok) throw new Error("Failed to load cars");
        return res.json();
      }),
      fetch("http://localhost:8080/customers").then((res) => {
        if (!res.ok) throw new Error("Failed to load customers");
        return res.json();
      }),
      fetch("http://localhost:8080/rentals").then((res) => {
        if (!res.ok) throw new Error("Failed to load rentals");
        return res.json();
      }),
      fetch("http://localhost:8080/payments").then((res) => {
        if (!res.ok) throw new Error("Failed to load payments");
        return res.json();
      }),
    ])
      .then(([carData, customerData, rentalData, paymentData]) => {
        setCars(carData);
        setCustomers(customerData);
        setRentals(rentalData);
        setPayments(paymentData);
        setMessage("");
      })
      .catch((error) => {
        console.error("Dashboard error:", error);
        setMessage("Unable to load dashboard data.");
      });
  }, []);

  const totalPayments = payments.reduce(
    (total, payment) => total + Number(payment.amount || 0),
    0
  );

  const stats = [
    { title: "Total Cars", value: cars.length, icon: "🚗" },
    { title: "Total Customers", value: customers.length, icon: "👥" },
    { title: "Total Bookings", value: rentals.length, icon: "📋" },
    {
      title: "Total Payments",
      value: `₹${totalPayments.toLocaleString("en-IN")}`,
      icon: "💰",
    },
  ];

  const recentRentals = [...rentals]
    .sort((a, b) => b.rentalID - a.rentalID)
    .slice(0, 5);

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Overview of your car rental business.</p>

        <div className="admin-actions">
          <button onClick={() => setPage("manageCars")}>
            Manage Cars
          </button>

          <button onClick={() => setPage("manageCustomers")}>
            Manage Customers
          </button>

          <button onClick={() => setPage("manageBookings")}>
            Manage Bookings
          </button>
        </div>
      </div>

      {message && (
        <p className="admin-message">{message}</p>
      )}

      {!message && (
        <>
          <div className="admin-stats">
            {stats.map((stat) => (
              <div className="admin-stat-card" key={stat.title}>
                <div className="admin-stat-icon">{stat.icon}</div>
                <p>{stat.title}</p>
                <h2>{stat.value}</h2>
              </div>
            ))}
          </div>

          <div className="admin-recent">
            <h2>Recent Bookings</h2>

            {recentRentals.length === 0 ? (
              <p>No bookings available.</p>
            ) : (
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Rental ID</th>
                      <th>Customer ID</th>
                      <th>Car ID</th>
                      <th>Rental Date</th>
                      <th>Return Date</th>
                    </tr>
                  </thead>

                  <tbody>
                    {recentRentals.map((rental) => (
                      <tr key={rental.rentalID}>
                        <td>{rental.rentalID}</td>
                        <td>{rental.customerID}</td>
                        <td>{rental.carID}</td>
                        <td>{rental.rentalDate}</td>
                        <td>{rental.returnDate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default AdminDashboard;
