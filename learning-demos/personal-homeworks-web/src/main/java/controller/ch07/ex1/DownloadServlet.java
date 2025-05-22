package controller.ch07.ex1;

import java.io.IOException;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import model.util.CookieUtil;
import model.User;
import model.io.UserIO;

/**
 * Servlet implementation class DownloadServlet
 */

@SuppressWarnings("serial")
@WebServlet("/exercises/ex7-1/download")
public class DownloadServlet extends HttpServlet {

	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		// get current action
		String action = request.getParameter("action");
		if (action == null) {
			action = "viewAlbums"; // default action
		}

		// perform action and set URL to appropriate page
		String url = "/exercises/ex7-1/index.jsp";
		if (action.equals("viewAlbums")) {
			url = "/exercises/ex7-1/index.jsp";
		} else if (action.equals("checkUser")) {
			url = checkUser(request, response);
		} else if (action.equals("viewCookies")) {
			url = "/exercises/ex7-1/view_cookies.jsp";
		} else if (action.equals("deleteCookies")) {
			url = deleteCookies(request, response);
		}

		// forward to the view
		getServletContext().getRequestDispatcher(url).forward(request, response);
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		String action = request.getParameter("action");

		// perform action and set URL to appropriate page
		String url = "/index.jsp";
		if (action.equals("registerUser")) {
			url = registerUser(request, response);
		}

		// forward to the view
		getServletContext().getRequestDispatcher(url).forward(request, response);
	}

	private String registerUser(HttpServletRequest request, HttpServletResponse response) throws IOException {

		// get the user data
		String email = request.getParameter("email");
		String firstName = request.getParameter("firstName");
		String lastName = request.getParameter("lastName");

		// store the data in a User object
		User user = new User();
		user.setEmail(email);
		user.setFirstName(firstName);
		user.setLastName(lastName);

		// write the User object to a file
		ServletContext sc = getServletContext();
		String path = sc.getRealPath("/WEB-INF/data/EmailList.txt");
		UserIO.add(user, path);

		// store the User object as a session attribute
		HttpSession session = request.getSession();
		session.setAttribute("user", user);

		// add a cookie that stores the user's email to browser
		Cookie c = new Cookie("userEmail", email);
		c.setMaxAge(3 * 365 * 24 * 60 * 60); // set age to 3 years
		c.setPath("/"); // allow entire app to access it
		response.addCookie(c);

		// create an return a URL for the appropriate Download page
		String productCode = (String) session.getAttribute("productCode");
		String url = "/exercises/ex7-1/download/" + productCode + "_download.jsp";
		return url;
	}

	private String checkUser(HttpServletRequest request, HttpServletResponse response) throws IOException {

		String productCode = request.getParameter("productCode");
		HttpSession session = request.getSession();
		session.setAttribute("productCode", productCode);
		
		User user = (User) session.getAttribute("user");

		String url;
		// if User object doesn't exist, check email cookie
		if (user == null) {
			Cookie[] cookies = request.getCookies();
			String emailAddress = CookieUtil.getCookieValue(cookies, "userEmail");

			// if cookie doesn't exist, go to Registration page
			if (emailAddress == null || emailAddress.equals("")) {
				url = "/exercises/ex7-1/register.jsp";
			}

			// if cookie exists, create User object and go to Downloads page
			else {
				ServletContext sc = getServletContext();
				String path = sc.getRealPath("/WEB-INF/data/EmailList.txt");
				user = UserIO.getUser(emailAddress, path);
				session.setAttribute("user", user);
				url = "/exercises/ex7-1/download/" + productCode + "_download.jsp";
			}
		}

		// if User object exists, go to Downloads page
		else {
			url = "/exercises/ex7-1/download/" + productCode + "_download.jsp";
		}
		return url;
	}

	private String deleteCookies(HttpServletRequest request, HttpServletResponse response) {

		Cookie[] cookies = request.getCookies();
		for (Cookie cookie : cookies) {
			cookie.setMaxAge(0); // delete the cookie
			cookie.setPath("/"); // allow the download application to access it
			response.addCookie(cookie);
		}
		String url = "/exercises/ex7-1/index.jsp";
		return url;
	}
}
