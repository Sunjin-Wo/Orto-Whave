package com.orthowave.backend.repository;

import com.orthowave.backend.model.Product;
import com.orthowave.backend.model.Product.ProductCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCategory(ProductCategory category);
    List<Product> findByActive(boolean active);
    List<Product> findByNameContainingIgnoreCase(String name);
    List<Product> findByCategoryAndActive(ProductCategory category, boolean active);
} 