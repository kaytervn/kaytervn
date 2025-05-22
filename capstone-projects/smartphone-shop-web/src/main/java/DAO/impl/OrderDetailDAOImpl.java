package DAO.impl;

import java.util.List;

import org.hibernate.HibernateException;
import org.hibernate.Session;

import model.OrderDetail;
import service.IOderDetailService;
import utility.HibernateUtility;

public class OrderDetailDAOImpl extends BaseDAOImpl<OrderDetail> implements IOderDetailService {

	@Override
	public List<OrderDetail> getOrderDetailsByOrderId(int orderId) {
		try (Session session = HibernateUtility.getSessionFactory().openSession()) {
			String hql = "FROM OrderDetail od WHERE od.order.id = :orderId";
			List<OrderDetail> od = session.createQuery(hql, OrderDetail.class).setParameter("orderId", orderId)
					.getResultList();
			return od;
		} catch (HibernateException e) {
			e.printStackTrace();
			return null;
		}
	}

	@Override
	public List<OrderDetail> getOrderDetailsByUserId(int userId) {
		try (Session session = HibernateUtility.getSessionFactory().openSession()) {
			String hql = "FROM OrderDetail od WHERE od.user.id = :userId";
			List<OrderDetail> od = session.createQuery(hql, OrderDetail.class).setParameter("userId", userId)
					.getResultList();
			return od;
		} catch (HibernateException e) {
			e.printStackTrace();
			return null;
		}
	}

}
