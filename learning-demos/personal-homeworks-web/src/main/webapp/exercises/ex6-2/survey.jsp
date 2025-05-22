<%@ include file="/includes/header.jsp"%>
<div id="mainCSS">
	<h1>Thanks for taking our survey!</h1>
	<p>Here is the information that you entered:</p>

	<label><b>Email:</b></label> <span>${survey.email}</span> <br> <label><b>First
			Name:</b></label> <span>${survey.firstName}</span> <br> <label><b>Last
			Name:</b></label> <span>${survey.lastName}</span> <br> <label><b>Date
			Of Birth:</b></label> <span>${survey.date}</span> <br> <label><b>Heard
			From:</b></label> <span>${survey.heardFrom}</span> <br> <label><b>Updates:</b></label>
	<span>${survey.updateOK}</span> <br> <label><b>Get
			Email:</b></label> <span>${survey.emailOK}</span> <br>
	<c:if test="${survey.updateOK == 'Yes'}">
		<label><b>Contact Via:</b></label>
		<span>${survey.contactVia}</span>
		<br>
	</c:if>

	<p>To enter another survey, click on the Back button in your
		browser or the Return button shown below.</p>

	<label>&nbsp;</label>
	<form action="" method="get">
		<input type="hidden" name="action" value="join"> <input
			type="submit" value="Return" class="btn">
	</form>
</div>
<%@ include file="/includes/footer.jsp"%>