
function Navbar({
  setPage,
  loggedIn,
  onLogout,
  adminLoggedIn,
  onAdminLogout,
}) {
  return (
    <div className="navbar">
      <h2>Car Rental</h2>

      <div className="navbar-buttons">
        <button onClick={() => setPage("home")}>
          Home
        </button>

        <button onClick={() => setPage("cars")}>
          Cars
        </button>

        {loggedIn && (
          <button onClick={() => setPage("bookings")}>
            My Bookings
          </button>
        )}

        {!loggedIn && !adminLoggedIn && (
          <>
            <button onClick={() => setPage("login")}>
              Login
            </button>

            <button onClick={() => setPage("register")}>
              Register
            </button>
          </>
        )}

        {!adminLoggedIn && (
          <button onClick={() => setPage("adminLogin")}>
            Admin Login
          </button>
        )}

        {adminLoggedIn && (
          <>
            <button onClick={() => setPage("admin")}>
              Dashboard
            </button>

            <button onClick={onAdminLogout}>
              Admin Logout
            </button>
          </>
        )}

        {loggedIn && (
          <button onClick={onLogout}>
            Logout
          </button>
        )}
      </div>
    </div>
  );
}

export default Navbar;
