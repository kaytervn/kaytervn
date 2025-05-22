package service;

import java.util.List;

public interface IBaseService<E> {
	@SuppressWarnings("hiding")
	<E> List<E> getAll(Class<E> entityClass);

	void insert(E e);

	void update(E e);

	@SuppressWarnings("hiding")
	<E> void delete(Class<E> entityClass, int id);

	@SuppressWarnings("hiding")
	<E> E findById(Class<E> entityClass, int id);
}
