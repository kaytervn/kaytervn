package controller.ch07;

import java.io.*;
import javax.servlet.*;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;

import model.Cart;
import model.LineItem;
import model.Product;
import model.io.ProductIO;

@SuppressWarnings("serial")
@WebServlet("/exercises/ex7-3/cart")
public class CartServlet extends HttpServlet {

	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		String url = "/exercises/ex7-3/index.jsp";
		ServletContext sc = getServletContext();

		// get current action
		String action = request.getParameter("action");
		if (action == null) {
			action = "cart"; // default action
		}

		HttpSession session = request.getSession();

		Cart cart = (Cart) session.getAttribute("cart");
		if (cart == null) {
			cart = new Cart();
		}

		String productCode = request.getParameter("productCode");
		String quantityString = request.getParameter("quantity");
		String path = sc.getRealPath("/WEB-INF/data/products.txt");

		Product product = ProductIO.getProduct(productCode, path);
		LineItem lineItem = new LineItem();

		// perform action and set URL to appropriate page
		if (action.equals("add")) {

			int quantity = cart.getQuantity(productCode);
			if (quantity == -1) {
				quantity = 1;
			} else {
				quantity += 1;
			}

			lineItem.setProduct(product);
			lineItem.setQuantity(quantity);
			cart.addItem(lineItem);
			
			url = "/exercises/ex7-3/cart.jsp";
		} else if (action.equals("cart")) {
			// if the user enters a negative or invalid quantity,
			// the quantity is automatically reset to 1.
			int quantity;
			try {
				quantity = Integer.parseInt(quantityString);
				if (quantity < 0) {
					quantity = 1;
				}
			} catch (NumberFormatException nfe) {
				quantity = 1;
			}

			lineItem.setProduct(product);
			lineItem.setQuantity(quantity);

			if (quantity > 0) {
				cart.addItem(lineItem);
			} else if (quantity == 0) {
				cart.removeItem(lineItem);
			}
			url = "/exercises/ex7-3/cart.jsp";
		}
		session.setAttribute("cart", cart);
		sc.getRequestDispatcher(url).forward(request, response);
	}

	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		doPost(request, response);
	}
}