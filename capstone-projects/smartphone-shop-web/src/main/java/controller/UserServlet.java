package controller;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

import javax.servlet.*;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;

import model.User;
import model.User.Gender;
import model.User.Role;
import model.User.Status;
import service.impl.OrderServiceImpl;
import service.impl.UserServiceImpl;
import utility.Upload;

@SuppressWarnings("serial")
@WebServlet(urlPatterns = { "/viewUser", "/updateUser", "/deleteUser", "/listUser" })
@MultipartConfig
public class UserServlet extends HttpServlet {

	UserServiceImpl userService = new UserServiceImpl();
	OrderServiceImpl orderService = new OrderServiceImpl();

	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		request.setCharacterEncoding("UTF-8");
		response.setCharacterEncoding("UTF-8");
		String url = request.getRequestURL().toString();
		if (url.contains("listUser")) {
			List<User> listUser = userService.getAll(User.class);
			request.setAttribute("listUser", listUser);
			request.getRequestDispatcher("/views/admin/user/user-list.jsp").forward(request, response);
		} else if (url.contains("viewUser")) {
			int id = Integer.parseInt(request.getParameter("id"));
			request.setAttribute("user", userService.findById(User.class, id));
			request.setAttribute("listOrder", orderService.getOrderListByUserId(id));
			request.getRequestDispatcher("/views/admin/user/view-user.jsp").forward(request, response);
		} else if (url.contains("updateUser")) {
			int id = Integer.parseInt(request.getParameter("id"));
			request.setAttribute("user", userService.findById(User.class, id));
			request.getRequestDispatcher("/views/admin/user/update-user.jsp").forward(request, response);
		}
	}

	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		request.setCharacterEncoding("UTF-8");
		response.setCharacterEncoding("UTF-8");

		String url = request.getRequestURL().toString();
		if (url.contains("updateUser")) {
			updateUser(request, response);
		} else if (url.contains("deleteUser")) {
			deleteUser(request, response);
		}
	}

	protected void updateUser(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		Upload ulp = new Upload();
		int id = Integer.parseInt(request.getParameter("id"));
		User user = userService.findById(User.class, id);
		user.setName(request.getParameter("name"));
		user.setBirthdate(request.getParameter("birthdate"));
		user.setPhoneNumber(request.getParameter("phoneNumber"));
		user.setPassword(request.getParameter("password"));
		switch (request.getParameter("gender")) {
		case "male":
			user.setGender(Gender.MALE);
			break;
		case "female":
			user.setGender(Gender.FEMALE);
			break;
		case "unknown":
			user.setGender(Gender.UNKNOWN);
			break;
		}
		switch (request.getParameter("role")) {
		case "admin":
			user.setRole(Role.ADMIN);
			break;
		case "user":
			user.setRole(Role.USER);
			break;
		}
		switch (request.getParameter("status")) {
		case "active":
			user.setStatus(Status.ACTIVE);
			break;
		case "inactive":
			user.setStatus(Status.INACTIVE);
			break;
		}
		Part filePart = request.getPart("image");
		if (filePart != null) {
			InputStream inputStream = filePart.getInputStream();
			byte[] imageBytes = inputStream.readAllBytes();
			String imageData = ulp.byteArrayToImageData(imageBytes);
			if (imageBytes.length > 0) {
				user.setImage(imageData);
			}
		}
		userService.update(user);
		response.sendRedirect(request.getContextPath() + "/listUser");
	}

	protected void deleteUser(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		int id = Integer.parseInt(request.getParameter("id"));
		userService.delete(User.class, id);
		response.sendRedirect("listUser");
	}
}
