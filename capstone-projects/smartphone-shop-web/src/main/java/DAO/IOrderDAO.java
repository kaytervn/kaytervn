package DAO;

import java.util.List;

import model.Order;

public interface IOrderDAO {
	List<Order> getOrderListByUserId(int userId);
}
