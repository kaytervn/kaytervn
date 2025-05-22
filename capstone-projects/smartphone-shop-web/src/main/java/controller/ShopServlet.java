package controller;

import java.io.IOException;
import java.util.List;

import javax.servlet.*;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;

import model.Brand;
import model.Product;
import service.impl.BrandServiceImpl;
import service.impl.ProductServiceImpl;

@SuppressWarnings("serial")
@WebServlet(urlPatterns = { "/shop", "/paging", "/search", "/viewProduct" })
@MultipartConfig
public class ShopServlet extends HttpServlet {
	ProductServiceImpl productService = new ProductServiceImpl();
	BrandServiceImpl brandService = new BrandServiceImpl();

	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		request.setCharacterEncoding("UTF-8");
		response.setCharacterEncoding("UTF-8");
		String url = request.getRequestURL().toString();
		if (url.contains("shop")) {
			List<Product> listProduct = productService.filterProduct("", 1);
			request.setAttribute("listProduct", listProduct);
			request.setAttribute("search", "");
			request.setAttribute("numberOfPages", productService.searchProduct("").size() / 8 + 1);
			request.setAttribute("currentPage", 1);
			request.getRequestDispatcher("/views/shop.jsp").forward(request, response);
		}
	}

	@SuppressWarnings("unchecked")
	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		request.setCharacterEncoding("UTF-8");
		response.setCharacterEncoding("UTF-8");
		String url = request.getRequestURL().toString();
		int currentPage = 1;
		if (url.contains("paging") || url.contains("search")) {
			if (url.contains("paging")) {
				currentPage = Integer.parseInt(request.getParameter("page"));
			}
			String search = request.getParameter("search");
			List<Product> listProduct = productService.filterProduct(search, currentPage);
			request.setAttribute("listProduct", listProduct);
			request.setAttribute("numberOfPages", productService.searchProduct(search).size() / 8 + 1);
			request.setAttribute("currentPage", currentPage);
			request.setAttribute("search", search);
			request.getRequestDispatcher("/views/shop.jsp").forward(request, response);
		} else if (url.contains("viewProduct")) {
			Product product = (Product) productService.findById(Product.class,
					Integer.parseInt(request.getParameter("id")));
			request.setAttribute("product", product);
			request.setAttribute("brand", brandService.findById(Brand.class, product.getBrand().getId()));
			request.getRequestDispatcher("/views/view-product.jsp").forward(request, response);
		}
	}
}