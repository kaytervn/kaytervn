package controller.ch09;

import java.io.*;
import javax.servlet.*;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.util.ArrayList;

import model.io.ProductIO;
import model.Product;

@SuppressWarnings("serial")
@WebServlet("/exercises/ex9-2/loadProducts")
public class ProductsServlet extends HttpServlet {

	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		HttpSession session = request.getSession();

		String path = getServletContext().getRealPath("/WEB-INF/data/products.txt");
		ArrayList<Product> products = ProductIO.getProducts(path);
		session.setAttribute("products", products);

		String url = "/exercises/ex9-2/index.jsp";
		getServletContext().getRequestDispatcher(url).forward(request, response);
	}
	
	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		doGet(request, response);
	}
}