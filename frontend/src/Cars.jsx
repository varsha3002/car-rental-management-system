
import { useEffect, useMemo, useState } from "react";
import Booking from "./Booking";

const carImages = {
  Swift:
    "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=800&q=80",
  Innova:
    "https://images.unsplash.com/photo-1566933293069-b55c7f326dd4?auto=format&fit=crop&w=800&q=80",
  City:
    "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80",
  Creta:
    "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=800&q=80",
};

const fallbackImage =
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80";

function Cars({ customer, setPage }) {
  const [cars, setCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);

  const [people, setPeople] = useState("1");
  const [minMileage, setMinMileage] = useState("0");
  const [maxBudget, setMaxBudget] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [imageErrors, setImageErrors] = useState({});

  useEffect(() => {
    fetch("http://localhost:8080/cars")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Could not load cars");
        }

        return response.json();
      })
      .then((data) => setCars(data))
      .catch((err) => {
        console.error("Error fetching cars:", err);
        setError(
          "Unable to load cars. Please check whether the backend is running."
        );
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredCars = useMemo(() => {
    return cars.filter((car) => {
      const seats = Number(car.seatingCapacity ?? 0);
      const mileage = Number(car.mileage ?? 0);

      const price =
        car.pricePerDay == null ? null : Number(car.pricePerDay);

      const enoughSeats = seats >= Number(people);
      const enoughMileage = mileage >= Number(minMileage);

      const withinBudget =
        maxBudget === "" ||
        (price !== null &&
          Number.isFinite(price) &&
          price > 0 &&
          price <= Number(maxBudget));

      return enoughSeats && enoughMileage && withinBudget;
    });
  }, [cars, people, minMileage, maxBudget]);

  const handleRentNow = (car) => {
    if (!customer) {
      setPage("login");
      return;
    }

    if (car.pricePerDay == null || Number(car.pricePerDay) <= 0) {
      alert("The rental price for this car has not been set yet.");
      return;
    }

    setSelectedCar(car);
  };

  const clearFilters = () => {
    setPeople("1");
    setMinMileage("0");
    setMaxBudget("");
  };

  if (selectedCar) {
    return (
      <Booking
        car={selectedCar}
        customer={customer}
      />
    );
  }

  return (
    <div className="cars-page">
      <div className="cars-header">
        <h1>Explore Our Cars</h1>
        <p>
          Compare car details and find the right car for your trip.
        </p>
      </div>

      <div className="car-filters">
        <h2>Find Your Car</h2>

        <div className="filter-grid">
          <div className="filter-field">
            <label htmlFor="people">Number of people</label>

            <select
              id="people"
              value={people}
              onChange={(event) => setPeople(event.target.value)}
            >
              <option value="1">Any car</option>
              <option value="2">At least 2 people</option>
              <option value="4">At least 4 people</option>
              <option value="5">At least 5 people</option>
              <option value="6">At least 6 people</option>
              <option value="7">At least 7 people</option>
              <option value="8">At least 8 people</option>
            </select>
          </div>

          <div className="filter-field">
            <label htmlFor="mileage">Minimum mileage</label>

            <select
              id="mileage"
              value={minMileage}
              onChange={(event) => setMinMileage(event.target.value)}
            >
              <option value="0">Any mileage</option>
              <option value="10">At least 10 km/l</option>
              <option value="15">At least 15 km/l</option>
              <option value="20">At least 20 km/l</option>
            </select>
          </div>

          <div className="filter-field">
            <label htmlFor="budget">Maximum daily budget (₹)</label>

            <input
              id="budget"
              type="number"
              min="0"
              placeholder="Any budget"
              value={maxBudget}
              onChange={(event) => setMaxBudget(event.target.value)}
            />
          </div>

          <button type="button" onClick={clearFilters}>
            Clear Filters
          </button>
        </div>
      </div>

      {loading && <p>Loading cars...</p>}

      {error && <p className="cars-error">{error}</p>}

      {!loading && !error && (
        <>
          <p className="cars-count">
            Showing {filteredCars.length} of {cars.length} cars
          </p>

          {filteredCars.length === 0 ? (
            <p className="no-cars">
              No cars match your preferences. Try changing the filters.
            </p>
          ) : (
            <div className="car-list">
              {filteredCars.map((car) => {
                const imageUrl = imageErrors[car.carId]
                  ? fallbackImage
                  : carImages[car.model] || fallbackImage;

                return (
                  <div className="car-card" key={car.carId}>
                    <div className="car-image-container">
                      <img
                        className="car-image"
                        src={imageUrl}
                        alt={`${car.brand} ${car.model}`}
                        loading="lazy"
                        onError={() => {
                          setImageErrors((previous) => ({
                            ...previous,
                            [car.carId]: true,
                          }));
                        }}
                      />
                    </div>

                    <h2>
                      {car.brand} {car.model}
                    </h2>

                    <p>Year: {car.year}</p>

                    <p>
                      <strong>Seating:</strong>{" "}
                      {car.seatingCapacity} people
                    </p>

                    <p>
                      <strong>Mileage:</strong> {car.mileage} km/l
                    </p>

                    <h3 className="car-price">
                      {car.pricePerDay != null &&
                      Number(car.pricePerDay) > 0
                        ? `₹${Number(car.pricePerDay).toLocaleString("en-IN")} / day`
                        : "Price not available"}
                    </h3>

                    <button onClick={() => handleRentNow(car)}>
                      Rent Now
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Cars;
