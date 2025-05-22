package service;

import java.util.List;

import model.Product;

public interface IProductService {
	List<Product> filterProduct(String search, int pageNum);
	List<Product> searchProduct(String search);
}
