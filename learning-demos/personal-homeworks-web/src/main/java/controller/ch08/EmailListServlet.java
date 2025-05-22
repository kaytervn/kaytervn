package controller.ch08;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import model.User;
import model.io.UserIO;

/**
 * Servlet implementation class EmailListServlet
 */

@SuppressWarnings("serial")
@WebServlet("/exercises/ex8-1/emailList")
public class EmailListServlet extends HttpServlet {

	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		String url = "/exercises/ex8-1/index.jsp";
		HttpSession session = request.getSession();

		// get current action
		String action = request.getParameter("action");
		if (action == null) {
			action = "join"; // default action
		}

		// perform action and set URL to appropriate page
		if (action.equals("join")) {
			url = "/exercises/ex8-1/index.jsp"; // the "join" page
		} else if (action.equals("add")) {
			// get parameters from the request
			String firstName = request.getParameter("firstName");
			String lastName = request.getParameter("lastName");
			String email = request.getParameter("email");

			// store data in User object and save User object in db
			User user = new User(firstName, lastName, email);

			// validate the parameters
			String message;
			if (firstName == null || lastName == null || email == null || firstName.isEmpty() || lastName.isEmpty()
					|| email.isEmpty()) {
				
				message = "Please fill out all three text boxes.";
				request.setAttribute("message", message);
				url = "/exercises/ex8-1/index.jsp";
				
			} else {
				
				message = "";
				
				session.setAttribute("user", user);
				
				// write the User object to a file
				ServletContext sc = getServletContext();
				String path = sc.getRealPath("/WEB-INF/data/EmailList.txt");
				UserIO.add(user, path);

				url = "/exercises/ex8-1/thanks.jsp";
				
			}
		}

		Date currentDate = new Date();
		request.setAttribute("currentDate", currentDate);
		
		int currentYear = new GregorianCalendar().get(Calendar.YEAR);
		request.setAttribute("currentYear", currentYear);

		// create users list and store it in the session
		String path = getServletContext().getRealPath("/WEB-INF/data/EmailList.txt");
		ArrayList<User> users = UserIO.getUsers(path);
		session.setAttribute("users", users);

		// forward request and response objects to specified URL
		getServletContext().getRequestDispatcher(url).forward(request, response);
	}

	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		doPost(request, response);
	}
}
