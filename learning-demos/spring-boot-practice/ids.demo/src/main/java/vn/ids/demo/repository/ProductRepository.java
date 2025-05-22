package vn.ids.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.ids.demo.custom.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, String> {
}
