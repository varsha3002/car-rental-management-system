
import { useState } from "react";
import "./App.css";

import Navbar from "./Navbar";
import Cars from "./Cars";
import Login from "./Login";
import Register from "./Register";

function App() {
  const [page, setPage] = useState("home");
  const [loggedIn, setLoggedIn] = useState(false);
  const [customer, setCustomer] = useState(null);

  const handleLogin = (customerData) => {
    setCustomer(customerData);
    setLoggedIn(true);
    setPage("home");
  };

  const handleLogout = () => {
    setCustomer(null);
    setLoggedIn(false);
    setPage("home");
  };

  return (
    <div className="app">
      <Navbar
        page={page}
        setPage={setPage}
        loggedIn={loggedIn}
        customer={customer}
        onLogout={handleLogout}
      />

      <main>
        {page === "home" && (
          <section className="home-page">
            <div className="home-hero">
              <div className="home-content">
                <span className="home-tag">YOUR JOURNEY STARTS HERE</span>

                <h1>
                  Find Your Perfect
                  <span> Ride</span>
                </h1>

                <p>
                  Discover comfortable and affordable cars for your next
                  journey. Choose your car and enjoy the ride.
                </p>

                <div className="home-actions">
                  <button onClick={() => setPage("cars")}>
                    Explore Cars
                  </button>

                  {!loggedIn && (
                    <button
                      className="secondary-button"
                      onClick={() => setPage("login")}
                    >
                      Sign In
                    </button>
                  )}
                </div>

                <div className="home-features">
                  <div>
                    <strong>Easy</strong>
                    <span>Booking</span>
                  </div>
                  <div>
                    <strong>Flexible</strong>
                    <span>Travel</span>
                  </div>
                  <div>
                    <strong>Simple</strong>
                    <span>Payments</span>
                  </div>
                </div>
              </div>

              <div className="home-illustration">
                <div className="illustration-circle">
                  <span role="img" aria-label="Car illustration">
                    🚙
                  </span>
                </div>
                <div className="illustration-caption">
                  <span>Ready for your next adventure?</span>
                </div>
              </div>
            </div>

            <section className="home-bottom">
              <h2>Everything you need for your journey</h2>
              <p>
                Browse available cars, choose your dates, and manage your
                bookings in one place.
              </p>

              <div className="home-feature-cards">
                <article className="home-feature-card">
                  <div className="feature-icon">🚘</div>
                  <h3>Explore Cars</h3>
                  <p>Find a car that suits your travel needs.</p>
                  <button onClick={() => setPage("cars")}>
                    View Cars
                  </button>
                </article>

                <article className="home-feature-card">
                  <div className="feature-icon">📅</div>
                  <h3>Easy Booking</h3>
                  <p>Select your rental dates and see the estimated total.</p>
                  <button onClick={() => setPage("cars")}>
                    Book a Car
                  </button>
                </article>

                <article className="home-feature-card">
                  <div className="feature-icon">🔑</div>
                  <h3>Your Account</h3>
                  <p>Sign in to continue with your rental journey.</p>
                  <button
                    onClick={() => setPage(loggedIn ? "home" : "login")}
                  >
                    {loggedIn ? "Welcome Back" : "Sign In"}
                  </button>
                </article>
              </div>
            </section>
          </section>
        )}

        {page === "cars" && (
          <Cars customer={customer} setPage={setPage} />
        )}

        {page === "login" && (
          <Login
            setPage={setPage}
            setLoggedIn={setLoggedIn}
            setCustomer={setCustomer}
            onLogin={handleLogin}
          />
        )}

        {page === "register" && (
          <Register setPage={setPage} />
        )}
      </main>
    </div>
  );
}

export default App;
