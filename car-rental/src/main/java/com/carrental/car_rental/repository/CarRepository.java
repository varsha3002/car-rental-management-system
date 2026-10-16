package com.carrental.car_rental.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.carrental.car_rental.entity.Car;

public interface CarRepository extends JpaRepository<Car, Integer> {
}