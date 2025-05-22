package DAO.impl;

import java.util.List;

import org.hibernate.HibernateException;
import org.hibernate.Session;

import DAO.IOrderDAO;
import model.Order;
import utility.HibernateUtility;

public class OrderDAOImpl extends BaseDAOImpl<Order> implements IOrderDAO {
	@Override
	public List<Order> getOrderListByUserId(int userId) {
		try (Session session = HibernateUtility.getSessionFactory().openSession()) {
			String hql = "FROM Order od WHERE od.user.id = :userId";
			List<Order> od = session.createQuery(hql, Order.class).setParameter("userId", userId).getResultList();
			return od;
		} catch (HibernateException e) {
			e.printStackTrace();
			return null;
		}
	}
}
