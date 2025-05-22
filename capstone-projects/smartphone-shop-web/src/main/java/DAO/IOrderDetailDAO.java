package DAO;

import java.util.List;

import model.OrderDetail;

public interface IOrderDetailDAO {
	List<OrderDetail> getOrderDetailsByOrderId(int orderId);
	List<OrderDetail> getOrderDetailsByUserId(int userId);
}
