package controller;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

import javax.servlet.*;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;

import model.Brand;
import model.Product;
import service.impl.BrandServiceImpl;
import service.impl.ProductServiceImpl;
import utility.Upload;

@SuppressWarnings("serial")
@WebServlet(urlPatterns = { "/addProduct", "/updateProduct", "/deleteProduct", "/listProduct" })
@MultipartConfig
public class ProductServlet extends HttpServlet {

	BrandServiceImpl brandService = new BrandServiceImpl();
	ProductServiceImpl productService = new ProductServiceImpl();

	@SuppressWarnings("unchecked")
	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		request.setCharacterEncoding("UTF-8");
		response.setCharacterEncoding("UTF-8");
		List<Brand> listBrand = brandService.getAll(Brand.class);
		request.setAttribute("listBrand", listBrand);
		String url = request.getRequestURL().toString();
		if (url.contains("listProduct")) {
			List<Product> listProduct = productService.getAll(Product.class);
			request.setAttribute("listProduct", listProduct);
			request.getRequestDispatcher("/views/admin/product/product-list.jsp").forward(request, response);
		} else if (url.contains("addProduct")) {
			request.getRequestDispatcher("/views/admin/product/add-product.jsp").forward(request, response);
		} else if (url.contains("updateProduct")) {
			int id = Integer.parseInt(request.getParameter("id"));
			request.setAttribute("product", productService.findById(Product.class, id));
			request.getRequestDispatcher("/views/admin/product/update-product.jsp").forward(request, response);
		}
	}

	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		request.setCharacterEncoding("UTF-8");
		response.setCharacterEncoding("UTF-8");

		String url = request.getRequestURL().toString();
		if (url.contains("addProduct")) {
			addProduct(request, response);
		} else if (url.contains("updateProduct")) {
			updateProduct(request, response);
		} else if (url.contains("deleteProduct")) {
			deleteProduct(request, response);
		}
	}

	@SuppressWarnings("unchecked")
	protected void addProduct(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		Upload upl = new Upload();
		Product product = new Product();
		product.setBrand(brandService.findById(Brand.class, Integer.parseInt(request.getParameter("brand"))));
		product.setName(request.getParameter("name"));
		product.setPrice(Double.parseDouble(request.getParameter("price")));
		product.setStorage(Double.parseDouble(request.getParameter("storage")));
		product.setRam(Double.parseDouble(request.getParameter("ram")));
		product.setOs(request.getParameter("os"));
		product.setDescription(request.getParameter("description"));
		product.setQuantity(Integer.parseInt(request.getParameter("quantity")));
		Part filePart = request.getPart("image");
		if (filePart != null) {
			InputStream inputStream = filePart.getInputStream();
			byte[] imageBytes = inputStream.readAllBytes();
			String imageData = upl.byteArrayToImageData(imageBytes);
			if (imageBytes.length > 0) {
				product.setImage(imageData);
			}
		}
		productService.insert(product);
		response.sendRedirect("listProduct");
	}

	@SuppressWarnings("unchecked")
	protected void updateProduct(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		Upload upl = new Upload();
		Product product = (Product) productService.findById(Product.class,
				Integer.parseInt(request.getParameter("id")));
		product.setBrand(brandService.findById(Brand.class, Integer.parseInt(request.getParameter("brand"))));
		product.setName(request.getParameter("name"));
		product.setPrice(Double.parseDouble(request.getParameter("price")));
		product.setStorage(Double.parseDouble(request.getParameter("storage")));
		product.setRam(Double.parseDouble(request.getParameter("ram")));
		product.setOs(request.getParameter("os"));
		product.setDescription(request.getParameter("description"));
		product.setQuantity(Integer.parseInt(request.getParameter("quantity")));
		Part filePart = request.getPart("image");
		if (filePart != null) {
			InputStream inputStream = filePart.getInputStream();
			byte[] imageBytes = inputStream.readAllBytes();
			String imageData = upl.byteArrayToImageData(imageBytes);
			if (imageBytes.length > 0) {
				product.setImage(imageData);
			}
		}
		productService.update(product);
		response.sendRedirect("listProduct");
	}

	@SuppressWarnings("unchecked")
	protected void deleteProduct(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		int id = Integer.parseInt(request.getParameter("id"));
		productService.delete(Product.class, id);
		response.sendRedirect("listProduct");
	}
}
