package controller;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;

import javax.servlet.*;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;

import model.Order;
import model.OrderDetail;
import model.Product;
import service.impl.OrderDetailServiceImpl;
import service.impl.OrderServiceImpl;
import service.impl.ProductServiceImpl;
import service.impl.UserServiceImpl;
import utility.Email;

@SuppressWarnings("serial")
@WebServlet(urlPatterns = { "/addToCart", "/removeCart", "/updateCart", "/viewCart", "/checkout" })
@MultipartConfig
public class CartServlet extends HttpServlet {

	ProductServiceImpl productService = new ProductServiceImpl();
	UserServiceImpl userService = new UserServiceImpl();
	OrderDetailServiceImpl orderDetailService = new OrderDetailServiceImpl();
	OrderServiceImpl orderService = new OrderServiceImpl();

	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		request.setCharacterEncoding("UTF-8");
		response.setCharacterEncoding("UTF-8");
		String url = request.getRequestURL().toString();
		if (url.contains("viewCart")) {
			request.getRequestDispatcher("/views/cart.jsp").forward(request, response);
		} else if (url.contains("addToCart")) {
			addToCart(request, response);
		} else if (url.contains("checkout")) {
			request.getRequestDispatcher("/views/add-order.jsp").forward(request, response);
		}
	}

	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		request.setCharacterEncoding("UTF-8");
		response.setCharacterEncoding("UTF-8");
		String url = request.getRequestURL().toString();
		if (url.contains("addToCart")) {
			addToCart(request, response);
		} else if (url.contains("updateCart")) {
			updateCart(request, response);
		} else if (url.contains("removeCart")) {
			removeCart(request, response);
		} else if (url.contains("checkout")) {
			checkout(request, response);
		}
	}

	@SuppressWarnings("unchecked")
	private void checkout(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		Email sm = new Email();
		HttpSession session = request.getSession();
		Order order = (Order) session.getAttribute("order");
		if (order == null) {
			order = new Order();
		}
		String toEmail = request.getParameter("email");
		order.setUser(userService.findByEmail(toEmail));
		order.setDate(new SimpleDateFormat("yyyy-MM-dd").format(new Date()));
		order.setAddress(request.getParameter("address"));
		order.setPhone(request.getParameter("phone"));
		orderService.insert(order);
		for (OrderDetail orderDetail : order.getOrderDetails()) {
			orderDetail.setOrder(order);
			Product product = orderDetail.getProduct();
			product.setQuantity(product.getQuantity() - orderDetail.getQuantity());
			productService.update(product);
			orderDetailService.insert(orderDetail);
		}
		sm.sendEmail(toEmail, order);
		session.removeAttribute("order");
		request.getRequestDispatcher("/views/thankyou.jsp").forward(request, response);
	}

	@SuppressWarnings("unchecked")
	private void addToCart(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		HttpSession session = request.getSession();
		Order order = (Order) session.getAttribute("order");
		if (order == null) {
			order = new Order();
		}
		int product_id = Integer.parseInt(request.getParameter("product_id"));
		Product product = (Product) productService.findById(Product.class, product_id);
		OrderDetail orderDetail = new OrderDetail();
		orderDetail.setProduct(product);
		order.addOrderDetail(orderDetail);
		session.setAttribute("order", order);
		response.sendRedirect("viewCart");
	}

	@SuppressWarnings("unchecked")
	private void updateCart(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		HttpSession session = request.getSession();
		Order order = (Order) session.getAttribute("order");
		if (order == null) {
			order = new Order();
		}
		int product_id = Integer.parseInt(request.getParameter("product_id"));
		Product product = (Product) productService.findById(Product.class, product_id);
		int quantity = Integer.parseInt(request.getParameter("quantity"));
		if (quantity > product.getQuantity()) {
			request.setAttribute("error", "Quantity cannot exceed stock!");
			request.getRequestDispatcher("/views/cart.jsp").forward(request, response);
		} else {
			OrderDetail orderDetail = new OrderDetail();
			orderDetail.setProduct(product);
			orderDetail.setQuantity(quantity);
			order.updateOrderDetail(orderDetail);
			session.setAttribute("order", order);
			response.sendRedirect("viewCart");
		}
	}

	@SuppressWarnings("unchecked")
	private void removeCart(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		HttpSession session = request.getSession();
		Order order = (Order) session.getAttribute("order");
		if (order == null) {
			order = new Order();
		}
		int product_id = Integer.parseInt(request.getParameter("product_id"));
		OrderDetail orderDetail = new OrderDetail();
		orderDetail.setProduct((Product) productService.findById(Product.class, product_id));
		order.removeOrderDetail(orderDetail);
		session.setAttribute("order", order);
		response.sendRedirect("viewCart");
	}
}
