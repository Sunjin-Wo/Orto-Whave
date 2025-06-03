package com.ortowhave.repository;

import com.ortowhave.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {
    Optional<Patient> findByEmail(String email);
    
    Optional<Patient> findByUserId(Long userId);
    
    List<Patient> findByFirstNameContainingOrLastNameContaining(String firstName, String lastName);
}
