
import { useState } from "react";

function AdminLogin({ setPage, setAdminLoggedIn }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = (event) => {
    event.preventDefault();
    setMessage("");

    // Demo-only credentials.
    // Replace with backend authentication before deployment.
    if (username === "admin" && password === "Admin@123") {
      setAdminLoggedIn(true);
      setPage("admin");
    } else {
      setMessage("Invalid admin username or password.");
    }
  };

  return (
    <div className="container">
      <h1>Admin Login</h1>
      <p>Sign in to manage the car rental system.</p>

      <form onSubmit={handleLogin}>
        <div>
          <label>Admin Username:</label>
          <br />
          <input
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="Enter admin username"
            required
          />
        </div>

        <br />

        <div>
          <label>Password:</label>
          <br />
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter admin password"
            required
          />
        </div>

        <br />

        <button type="submit">Admin Login</button>
      </form>

      {message && (
        <p style={{ color: "red" }}>{message}</p>
      )}
    </div>
  );
}

export default AdminLogin;
