package controller;

import java.io.IOException;
import java.util.List;

import javax.servlet.*;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;

import model.Brand;
import service.impl.BrandServiceImpl;

@SuppressWarnings("serial")
@WebServlet(urlPatterns = { "/addBrand", "/updateBrand", "/deleteBrand", "/listBrand" })
public class BrandServlet extends HttpServlet {

	BrandServiceImpl brandService = new BrandServiceImpl();

	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		request.setCharacterEncoding("UTF-8");
		response.setCharacterEncoding("UTF-8");
		String url = request.getRequestURL().toString();
		if (url.contains("listBrand")) {
			List<Brand> listBrand = brandService.getAll(Brand.class);
			request.setAttribute("listBrand", listBrand);
			request.getRequestDispatcher("/views/admin/brand/brand-list.jsp").forward(request, response);
		} else if (url.contains("addBrand")) {
			request.getRequestDispatcher("/views/admin/brand/add-brand.jsp").forward(request, response);
		} else if (url.contains("updateBrand")) {
			int id = Integer.parseInt(request.getParameter("id"));
			request.setAttribute("brand", brandService.findById(Brand.class, id));
			request.getRequestDispatcher("/views/admin/brand/update-brand.jsp").forward(request, response);
		}
	}

	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		request.setCharacterEncoding("UTF-8");
		response.setCharacterEncoding("UTF-8");

		String url = request.getRequestURL().toString();
		if (url.contains("addBrand")) {
			addBrand(request, response);
		} else if (url.contains("updateBrand")) {
			updateBrand(request, response);
		} else if (url.contains("deleteBrand")) {
			deleteBrand(request, response);
		}
	}

	protected void addBrand(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		Brand brand = new Brand();
		brand.setName(request.getParameter("name"));
		brand.setCountry(request.getParameter("country"));
		brandService.insert(brand);
		response.sendRedirect(request.getContextPath() + "/listBrand");
	}

	protected void updateBrand(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		int id = Integer.parseInt(request.getParameter("id"));
		Brand brand = brandService.findById(Brand.class, id);
		brand.setName(request.getParameter("name"));
		brand.setCountry(request.getParameter("country"));
		brandService.update(brand);
		response.sendRedirect(request.getContextPath() + "/listBrand");
	}

	protected void deleteBrand(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		int id = Integer.parseInt(request.getParameter("id"));
		brandService.delete(Brand.class, id);
		response.sendRedirect("listBrand");
	}
}
