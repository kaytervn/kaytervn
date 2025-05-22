package DAO.impl;

import java.util.List;

import org.hibernate.HibernateException;
import org.hibernate.Session;

import DAO.IProductDAO;
import model.Product;
import utility.HibernateUtility;

@SuppressWarnings("rawtypes")
public class ProductDAOImpl extends BaseDAOImpl implements IProductDAO {
	@Override
	public List<Product> filterProduct(String search, int pageNum) {
		try (Session session = HibernateUtility.getSessionFactory().openSession()) {
			int pageSize = 8;
			String searchKeyword = "%" + search + "%";
			String hql = "FROM Product p " + "WHERE p.description LIKE :keyword " + "OR p.name LIKE :keyword "
					+ "OR p.os LIKE :keyword " + "OR CAST(p.price AS string) LIKE :keyword "
					+ "OR CAST(p.quantity AS string) LIKE :keyword " + "OR CAST(p.ram AS string) LIKE :keyword "
					+ "OR CAST(p.storage AS string) LIKE :keyword ";
			List<Product> products = session.createQuery(hql, Product.class).setParameter("keyword", searchKeyword)
					.setFirstResult((pageNum - 1) * pageSize).setMaxResults(pageSize).getResultList();
			return products;
		} catch (HibernateException e) {
			e.printStackTrace();
			return null;
		}
	}

	@Override
	public List<Product> searchProduct(String search) {
		try (Session session = HibernateUtility.getSessionFactory().openSession()) {
			String searchKeyword = "%" + search + "%";
			String hql = "FROM Product p " + "WHERE p.description LIKE :keyword " + "OR p.name LIKE :keyword "
					+ "OR p.os LIKE :keyword " + "OR CAST(p.price AS string) LIKE :keyword "
					+ "OR CAST(p.quantity AS string) LIKE :keyword " + "OR CAST(p.ram AS string) LIKE :keyword "
					+ "OR CAST(p.storage AS string) LIKE :keyword ";
			List<Product> products = session.createQuery(hql, Product.class).setParameter("keyword", searchKeyword)
					.getResultList();
			return products;
		} catch (HibernateException e) {
			e.printStackTrace();
			return null;
		}
	}
}
