package DAO.impl;

import DAO.IBaseDAO;

import org.hibernate.Session;
import org.hibernate.Transaction;
import utility.HibernateUtility;

import java.util.List;

public class BaseDAOImpl<E> implements IBaseDAO<E> {
	@SuppressWarnings("deprecation")
	@Override
	public void insert(E e) {
		Transaction transaction = null;
		Session session = HibernateUtility.getSessionFactory().openSession();
		try {
			transaction = session.beginTransaction();
			session.save(e);
			transaction.commit();
		} catch (Exception ex) {
			if (transaction != null) {
				transaction.rollback();
			}
			ex.printStackTrace();
		} finally {
			session.close();
		}
	}

	@SuppressWarnings("deprecation")
	@Override
	public void update(E e) {
		Transaction transaction = null;
		try (Session session = HibernateUtility.getSessionFactory().openSession()) {
			transaction = session.beginTransaction();
			session.update(e);
			transaction.commit();
		} catch (Exception ex) {
			if (transaction != null) {
				transaction.rollback();
			}
			ex.printStackTrace();
		}
	}

	@SuppressWarnings({ "deprecation", "hiding" })
	@Override
	public <E> void delete(Class<E> entityClass, int id) {
		Transaction transaction = null;
		try (Session session = HibernateUtility.getSessionFactory().openSession()) {
			transaction = session.beginTransaction();
			E e = session.get(entityClass, id);
			if (e != null) {
				session.delete(e);
			}
			transaction.commit();
		} catch (Exception ex) {
			if (transaction != null) {
				transaction.rollback();
			}
			ex.printStackTrace();
		}
	}

	@SuppressWarnings("hiding")
	@Override
	public <E> E findById(Class<E> entityClass, int id) {
		Session session = HibernateUtility.getSessionFactory().openSession();
		try {
			return session.get(entityClass, id);
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			session.close();
		}
		return null;

	}

	@SuppressWarnings({ "deprecation", "unchecked", "hiding" })
	@Override
	public <E> List<E> getAll(Class<E> entityClass) {
		Transaction transaction = null;
		List<E> listOfe = null;
		try (Session session = HibernateUtility.getSessionFactory().openSession()) {
			transaction = session.beginTransaction();
			listOfe = session.createQuery("from " + entityClass.getSimpleName()).getResultList();
			transaction.commit();
		} catch (Exception e) {
			if (transaction != null) {
				transaction.rollback();
			}
			e.printStackTrace();
		}
		return listOfe;
	}
}
