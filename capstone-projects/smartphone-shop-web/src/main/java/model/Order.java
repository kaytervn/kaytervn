package model;

import jakarta.persistence.*;

import java.text.NumberFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Entity
@Table(name = "orders")
public class Order {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "order_id")
	private int id;
	@ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id")
	private User user;
	@OneToMany(mappedBy = "order", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	private List<OrderDetail> orderDetails;
	@Column(name = "date")
	private String Date;
	@Column(name = "address")
	private String address;
	@Column(name = "phone")
	private String phone;

	public String getDate() {
		return Date;
	}

	public void setDate(String date) {
		Date = date;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public Order() {
		orderDetails = new ArrayList<>();
	}

	public List<OrderDetail> getOrderDetails() {
		return orderDetails;
	}

	public void setOrderDetails(List<OrderDetail> orderDetails) {
		this.orderDetails = orderDetails;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public Order(String date) {
		Date = date;
	}

	public Order(int id, String address, String phone) {
		this.id = id;
		this.address = address;
		this.phone = phone;
	}

	public double getTotal() {
		double total = 0;
		for (int i = 0; i < orderDetails.size(); i++) {
			total += orderDetails.get(i).getTotal();
		}
		return total;
	}

	public String getTotalCurrencyFormat() {
		NumberFormat currency = NumberFormat.getCurrencyInstance(Locale.US);
		return currency.format(this.getTotal());
	}

	public void addOrderDetail(OrderDetail orderDetail) {
		int product_id = orderDetail.getProduct().getId();
		for (int i = 0; i < orderDetails.size(); i++) {
			OrderDetail orderDetail1_temp = orderDetails.get(i);
			if (orderDetail1_temp.getProduct().getId() == product_id) {
				orderDetails.get(i).setQuantity(orderDetails.get(i).getQuantity() + 1);
				return;
			}
		}
		orderDetails.add(orderDetail);
	}

	public void updateOrderDetail(OrderDetail orderDetail) {
		int product_id = orderDetail.getProduct().getId();
		for (int i = 0; i < orderDetails.size(); i++) {
			OrderDetail orderDetail1_temp = orderDetails.get(i);
			if (orderDetail1_temp.getProduct().getId() == product_id) {
				orderDetails.get(i).setQuantity(orderDetail.getQuantity());
				return;
			}
		}
	}

	public void removeOrderDetail(OrderDetail orderDetail) {
		int product_id = orderDetail.getProduct().getId();
		for (int i = 0; i < orderDetails.size(); i++) {
			OrderDetail orderDetail1_temp = orderDetails.get(i);
			if (orderDetail1_temp.getProduct().getId() == product_id) {
				orderDetails.remove(i);
				return;
			}
		}
	}

	public Order(User user, String date) {
		this.user = user;
		Date = date;
	}
}
