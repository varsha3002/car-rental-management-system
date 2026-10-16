
import { useEffect, useState } from "react";

function ManageCars() {
  const [cars, setCars] = useState([]);
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [pricePerDay, setPricePerDay] = useState("");
  const [message, setMessage] = useState("");

  const fetchCars = () => {
    fetch("http://localhost:8080/cars")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load cars");
        }
        return response.json();
      })
      .then((data) => setCars(data))
      .catch((error) => {
        console.error(error);
        setMessage("Unable to load cars.");
      });
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const handleAddCar = (event) => {
    event.preventDefault();
    setMessage("");

    const newCar = {
      brand,
      model,
      year: Number(year),
      pricePerDay: Number(pricePerDay),
    };

    fetch("http://localhost:8080/cars", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newCar),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to add car");
        }
        return response.json();
      })
      .then(() => {
        setMessage("Car added successfully!");
        setBrand("");
        setModel("");
        setYear("");
        setPricePerDay("");
        fetchCars();
      })
      .catch((error) => {
        console.error(error);
        setMessage("Unable to add car. Check the backend.");
      });
  };

  const handleDeleteCar = (carID) => {
    if (!window.confirm("Are you sure you want to delete this car?")) {
      return;
    }

    fetch(`http://localhost:8080/cars/${carID}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete car");
        }

        setMessage("Car deleted successfully!");
        fetchCars();
      })
      .catch((error) => {
        console.error(error);
        setMessage(
          "Unable to delete car. It may be linked to existing bookings."
        );
      });
  };

  return (
    <div className="cars-page">
      <div className="cars-header">
        <h1>Manage Cars</h1>
        <p>Add new cars or manage existing cars.</p>
      </div>

      <form className="manage-car-form" onSubmit={handleAddCar}>
        <h2>Add New Car</h2>

        <label>Brand</label>
        <input
          type="text"
          value={brand}
          onChange={(event) => setBrand(event.target.value)}
          placeholder="e.g. Toyota"
          required
        />

        <label>Model</label>
        <input
          type="text"
          value={model}
          onChange={(event) => setModel(event.target.value)}
          placeholder="e.g. Innova"
          required
        />

        <label>Year</label>
        <input
          type="number"
          value={year}
          onChange={(event) => setYear(event.target.value)}
          min="1900"
          max="2100"
          required
        />

        <label>Price Per Day (₹)</label>
        <input
          type="number"
          value={pricePerDay}
          onChange={(event) => setPricePerDay(event.target.value)}
          min="1"
          required
        />

        <button type="submit">Add Car</button>

        {message && <p>{message}</p>}
      </form>

      <div className="cars-header">
        <h2>Existing Cars</h2>
      </div>

      <div className="car-list">
        {cars.map((car) => (
          <div className="car-card" key={car.carId}>
            <div className="car-icon">🚗</div>
            <h2>{car.brand} {car.model}</h2>
            <p>Car ID: {car.carId}</p>
            <p>Year: {car.year}</p>
            <p>Price: ₹{car.pricePerDay} per day</p>

            <button
              type="button"
              onClick={() => handleDeleteCar(car.carId)}
              style={{ background: "#dc2626" }}
            >
              Delete Car
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ManageCars;
