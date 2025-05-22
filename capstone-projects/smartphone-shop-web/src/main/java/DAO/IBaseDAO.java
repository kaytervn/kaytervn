package DAO;

import java.util.List;

public interface IBaseDAO<E> {
	void insert(E e);

	void update(E e);

	@SuppressWarnings("hiding")
	<E> void delete(Class<E> entityClass, int id);

	@SuppressWarnings("hiding")
	<E> E findById(Class<E> entityClass, int id);

	@SuppressWarnings("hiding")
	<E> List<E> getAll(Class<E> entityClass);
}
