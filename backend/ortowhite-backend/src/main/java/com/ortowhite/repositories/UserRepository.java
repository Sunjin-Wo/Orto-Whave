package com.ortowhite.repositories;

import com.ortowhite.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByEmail(String email);
    Optional<User> findByEmail(String email);
    
    // Métodos para el dashboard
    long countByEmailVerifiedTrue();
    long countByEmailVerifiedFalse();
    List<User> findTop5ByOrderByCreatedAtDesc();
} 