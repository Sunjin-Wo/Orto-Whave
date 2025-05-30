package com.ortowhite.api.repository;

import com.ortowhite.api.model.PendingRegistration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PendingRegistrationRepository extends JpaRepository<PendingRegistration, Long> {
    Optional<PendingRegistration> findByEmail(String email);
    Optional<PendingRegistration> findByEmailAndVerificationCode(String email, String verificationCode);
    boolean existsByEmail(String email);
    void deleteByEmail(String email);
} 