package controller.ch06;

import java.io.*;
import javax.servlet.*;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;

import model.Survey;

@SuppressWarnings("serial")
@WebServlet("/exercises/ex6-2/infoSurvey")
public class SurveyServlet extends HttpServlet {

	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		String url = "/index.jsp";

		// get current action
		String action = request.getParameter("action");
		if (action == null) {
			action = "join";
		}
		// perform action and set URL to appropriate page
		if (action.equals("join")) {
			url = "/exercises/ex6-2/index.jsp";
		} else if (action.equals("add")) {
			// get parameters from the request
			String firstName = request.getParameter("firstName");
			String lastName = request.getParameter("lastName");
			String email = request.getParameter("email");
			String date = request.getParameter("date");
			String heardFrom = request.getParameter("heardFrom");
			String updateOK = request.getParameter("updateOK");
			String emailOK = request.getParameter("emailOK");
			String contactVia = request.getParameter("contactVia");

			if (date == "") {
				date = "Unknown";
			}

			if (updateOK == null) {
				updateOK = "No";
			}

			if (emailOK == null) {
				emailOK = "No";
			}

			// store data in User object and save User object in db
			Survey survey = new Survey(firstName, lastName, email, date, heardFrom, updateOK, emailOK, contactVia);

			// set User object in request object and set URL
			request.setAttribute("survey", survey);
			url = "/exercises/ex6-2/survey.jsp"; // the "thanks" page
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