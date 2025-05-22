package service;

import java.util.List;

import model.OrderDetail;

public interface IOderDetailService {
	public List<OrderDetail> getOrderDetailsByOrderId(int orderId);
	public List<OrderDetail> getOrderDetailsByUserId(int userId);

}
