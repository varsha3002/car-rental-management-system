
package com.carrental.car_rental.repository;

import com.carrental.car_rental.entity.Rental;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RentalRepository extends JpaRepository<Rental, Integer> {

    List<Rental> findByCustomerID(int customerID);
}
