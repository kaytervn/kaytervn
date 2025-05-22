package DAO;

import java.util.List;

import model.Product;

public interface IProductDAO {
	List<Product> filterProduct(String search, int pageNum);
	List<Product> searchProduct(String search);
}
