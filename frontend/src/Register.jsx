import { useState } from "react";

function Register({ setPage }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = () => {
    const customer = {
      name: name,
      phone: phone,
    };

    fetch("http://localhost:8080/customers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(customer),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Registration failed");
        }

        return response.json();
      })
      .then((data) => {
        console.log("Registration successful:", data);
        setMessage("Registration successful! Please login.");
      })
      .catch((error) => {
        console.error("Registration error:", error);
        setMessage("Registration failed. Please try again.");
      });
  };

  return (
    <div className="container">
      <h1>Customer Registration</h1>

      <div>
        <label>Name:</label>
        <br />

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
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

      <button onClick={handleRegister}>
        Register
      </button>

      {message && <h3>{message}</h3>}
    </div>
  );
}

export default Register;