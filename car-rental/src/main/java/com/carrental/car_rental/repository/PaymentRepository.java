package com.carrental.car_rental.repository;

import com.carrental.car_rental.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<Payment, Integer> {

}