package com.ortowhave.repository;

import com.ortowhave.model.OrthopedicProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrthopedicProductRepository extends JpaRepository<OrthopedicProduct, Long> {
    List<OrthopedicProduct> findByCategory(String category);
    
    List<OrthopedicProduct> findByStatus(OrthopedicProduct.ProductStatus status);
    
    List<OrthopedicProduct> findByNameContaining(String name);
    
    List<OrthopedicProduct> findByStockGreaterThan(Integer stock);
}
