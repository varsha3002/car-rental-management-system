import { useState } from "react";

function Login({ setLoggedIn, setCustomer, setPage }) {
  const [customerId, setCustomerId] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = () => {
    fetch(`http://localhost:8080/customers/${customerId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Customer not found");
        }

        return response.json();
      })
      .then((customer) => {
        if (customer.phone === phone) {
          setLoggedIn(true);
          setCustomer(customer);

          // Go directly to Home after successful login
          setPage("home");
        } else {
          setMessage("Invalid phone number.");
        }
      })
      .catch((error) => {
        console.error("Login error:", error);
        setMessage("Customer not found.");
      });
  };

  return (
    <div className="container">
      <h1>Customer Login</h1>

      <div>
        <label>Customer ID:</label>
        <br />

        <input
          type="number"
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
          placeholder="Enter customer ID"
        />
      </div>

      <br />

      <div>
        <label>Phone:</label>
        <br />

        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Enter phone number"
        />
      </div>

      <br />

      <button onClick={handleLogin}>
        Login
      </button>

      {message && <h3>{message}</h3>}
    </div>
  );
}

export default Login;