
package com.carrental.car_rental.service;

import com.carrental.car_rental.entity.Rental;
import com.carrental.car_rental.repository.RentalRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RentalService {

    private final RentalRepository rentalRepository;

    public RentalService(RentalRepository rentalRepository) {
        this.rentalRepository = rentalRepository;
    }

    public List<Rental> getRentalsByCustomerID(int customerID) {
        return rentalRepository.findByCustomerID(customerID);
    }

    public List<Rental> getAllRentals() {
        return rentalRepository.findAll();
    }

    public Rental saveRental(Rental rental) {
        return rentalRepository.save(rental);
    }

    public void deleteRental(int rentalID) {
        rentalRepository.deleteById(rentalID);
    }
}
