package com.ortowhave.repository;

import com.ortowhave.model.OrthopedicService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrthopedicServiceRepository extends JpaRepository<OrthopedicService, Long> {
    List<OrthopedicService> findByActive(Boolean active);
    
    List<OrthopedicService> findByNameContaining(String name);
}
