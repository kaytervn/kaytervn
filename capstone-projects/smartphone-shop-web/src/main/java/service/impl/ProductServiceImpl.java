package service.impl;

import model.Product;
import service.IProductService;
import java.util.List;

import DAO.impl.ProductDAOImpl;

@SuppressWarnings("rawtypes")
public class ProductServiceImpl extends BaseServiceImpl implements IProductService {
	ProductDAOImpl userDAO = new ProductDAOImpl();

	@Override
	public List<Product> filterProduct(String search, int pageNum) {
		return userDAO.filterProduct(search, pageNum);
	}

	@Override
	public List<Product> searchProduct(String search) {
		return userDAO.searchProduct(search);
	}

}
