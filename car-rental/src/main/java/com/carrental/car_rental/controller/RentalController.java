
package com.carrental.car_rental.controller;

import com.carrental.car_rental.entity.Rental;
import com.carrental.car_rental.service.RentalService;

import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/rentals")
@CrossOrigin(origins = "http://localhost:5173")
public class RentalController {

    private final RentalService rentalService;

    public RentalController(RentalService rentalService) {
        this.rentalService = rentalService;
    }

    // Get all rentals
    @GetMapping
    public List<Rental> getAllRentals() {
        return rentalService.getAllRentals();
    }

    // Get rental by ID
    @GetMapping("/{rentalID}")
    public Rental getRentalByID(@PathVariable int rentalID) {
        return rentalService.getRentalByID(rentalID);
    }

    // Get rentals for a particular customer
    @GetMapping("/customer/{customerID}")
    public List<Rental> getRentalsByCustomerID(
            @PathVariable int customerID) {
        return rentalService.getRentalsByCustomerID(customerID);
    }

    // Add a new rental
    @PostMapping
    public Rental saveRental(@RequestBody Rental rental) {
        return rentalService.saveRental(rental);
    }

    // Delete a rental
    @DeleteMapping("/{rentalID}")
    public void deleteRental(@PathVariable int rentalID) {
        rentalService.deleteRental(rentalID);
    }
}
