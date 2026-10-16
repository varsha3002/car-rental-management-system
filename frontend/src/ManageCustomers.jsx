
import { useEffect, useState } from "react";

function ManageCustomers() {
  const [customers, setCustomers] = useState([]);
  const [message, setMessage] = useState("Loading customers...");

  const fetchCustomers = () => {
    fetch("http://localhost:8080/customers")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load customers");
        }
        return response.json();
      })
      .then((data) => {
        setCustomers(data);
        setMessage(
          data.length === 0 ? "No customers registered yet." : ""
        );
      })
      .catch((error) => {
        console.error("Error loading customers:", error);
        setMessage("Unable to load customers.");
      });
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleDelete = (customerID) => {
    if (!window.confirm("Are you sure you want to delete this customer?")) {
      return;
    }

    fetch(`http://localhost:8080/customers/${customerID}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete customer");
        }

        setMessage("Customer deleted successfully.");
        fetchCustomers();
      })
      .catch((error) => {
        console.error("Delete error:", error);
        setMessage(
          "Unable to delete customer. They may have existing bookings."
        );
      });
  };

  return (
    <div className="cars-page">
      <div className="cars-header">
        <h1>Manage Customers</h1>
        <p>View and manage registered customers.</p>
      </div>

      {message && (
        <p style={{ textAlign: "center" }}>{message}</p>
      )}

      <div className="car-list">
        {customers.map((customer) => (
          <div className="car-card" key={customer.customerID}>
            <div className="car-icon">👤</div>
            <h2>{customer.name}</h2>
            <p>Customer ID: {customer.customerID}</p>
            <p>Phone: {customer.phone}</p>

            <button
              style={{ background: "#dc2626" }}
              onClick={() => handleDelete(customer.customerID)}
            >
              Delete Customer
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ManageCustomers;
