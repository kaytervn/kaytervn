package service.impl;

import java.util.List;

import DAO.impl.OrderDAOImpl;
import model.Order;
import service.IOrderService;

public class OrderServiceImpl extends BaseServiceImpl<Order> implements IOrderService {

	OrderDAOImpl orderDAO = new OrderDAOImpl();
	
	@Override
	public List<Order> getOrderListByUserId(int userId) {
		return orderDAO.getOrderListByUserId(userId);
	}
}
