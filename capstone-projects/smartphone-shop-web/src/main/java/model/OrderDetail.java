package model;

import jakarta.persistence.*;

import java.text.NumberFormat;
import java.util.Locale;

@Entity
@Table(name = "orderdetails")
public class OrderDetail {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "order_detail_id")
	private int id;

	@ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	@JoinColumn(name = "order_id")
	private Order order;

	@ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	@JoinColumn(name = "product_id")
	private Product product;

	@Column(name = "quantity")
	private int quantity;

	public Product getProduct() {
		return product;
	}

	public void setProduct(Product product) {
		this.product = product;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public Order getOrder() {
		return order;
	}

	public void setOrder(Order order) {
		this.order = order;
	}

	public int getQuantity() {
		return quantity;
	}

	public void setQuantity(int quantity) {
		this.quantity = quantity;
	}

	public double getTotal() {
		double total = product.getPrice() * quantity;
		return total;
	}

	public String getTotalCurrencyFormat() {
		NumberFormat currency = NumberFormat.getCurrencyInstance(Locale.US);
		return currency.format(this.getTotal());
	}

	public OrderDetail() {
		this.quantity = 1;
		this.product = new Product();
	}

	public OrderDetail(Product product, int quantity) {
		this.product = product;
		this.quantity = quantity;
	}

	public OrderDetail(Product product) {
		this.product = product;
	}

	public OrderDetail(int id, int quantity) {
		this.id = id;
		this.quantity = quantity;
	}
}