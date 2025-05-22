package service.impl;

import DAO.impl.BaseDAOImpl;
import service.IBaseService;

import java.util.List;

public class BaseServiceImpl<E> implements IBaseService<E> {

	BaseDAOImpl<E> baseDAO = new BaseDAOImpl<E>();

	@SuppressWarnings("hiding")
	@Override
	public <E> List<E> getAll(Class<E> entityClass) {
		return baseDAO.getAll(entityClass);
	}

	@Override
	public void insert(E e) {
		baseDAO.insert(e);
	}

	@Override
	public void update(E e) {
		baseDAO.update(e);
	}

	@SuppressWarnings("hiding")
	@Override
	public <E> void delete(Class<E> entityClass, int id) {
		baseDAO.delete(entityClass, id);
	}

	@SuppressWarnings("hiding")
	@Override
	public <E> E findById(Class<E> entityClass, int id) {
		return baseDAO.findById(entityClass, id);
	}

}
