package com.ortowhave.repository;

import com.ortowhave.model.PendingRegistration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PendingRegistrationRepository extends JpaRepository<PendingRegistration, Long> {
    Optional<PendingRegistration> findByEmail(String email);
    
    Optional<PendingRegistration> findByEmailAndVerificationCode(String email, String verificationCode);
    
    Boolean existsByEmail(String email);
    
    Boolean existsByPhoneNumber(String phoneNumber);
    
    Optional<PendingRegistration> findByPhoneNumber(String phoneNumber);
}
