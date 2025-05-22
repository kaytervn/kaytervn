package controller.ch05;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import model.User;

/**
 * Servlet implementation class EmailListServlet
 */

@SuppressWarnings("serial")
@WebServlet(name = "MurachTestServlet", urlPatterns = { "/exercises/ex5-1/emailList" })
public class EmailListServlet extends HttpServlet {

	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		String url = "/index.jsp";

		// get current action
		String action = request.getParameter("action");
		if (action == null) {
			action = "join"; // default action
		}

		// perform action and set URL to appropriate page
		if (action.equals("join")) {
			url = "/exercises/ex5-1/index.jsp"; // the "join" page
		} else if (action.equals("add")) {
			// get parameters from the request
			String firstName = request.getParameter("firstName");
			String lastName = request.getParameter("lastName");
			String email = request.getParameter("email");

			System.out.println("EmailListServlet email: " + email);
			log("email=" + email);

			// store data in User object and save User object in db
			User user = new User(firstName, lastName, email);

			// validate the parameters
			String message;
			if (firstName == null || lastName == null || email == null || firstName.isEmpty() || lastName.isEmpty()
					|| email.isEmpty()) {

				message = "Please fill out all three text boxes.";
				url = "/exercises/ex5-1/index.jsp";
			} else {
				message = "";
				url = "/exercises/ex5-1/thanks.jsp";
			}
			request.setAttribute("user", user);
			request.setAttribute("message", message);

		}

		// forward request and response objects to specified URL
		getServletContext().getRequestDispatcher(url).forward(request, response);
	}

	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		doPost(request, response);
	}
}
