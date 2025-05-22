<%@ include file="/includes/header.jsp"%>
<div id="mainCSS">
	<h1>Download registration</h1>
	<p>To register for our downloads, enter your name and email address
		below. Then, click on the Submit button.</p>
	<form action="download" method="post">
		<input type="hidden" name="action" value="registerUser"> <label
			class="pad_top">Email:</label> <input type="email" name="email"
			value="${user.email}"><br> <label class="pad_top">First
			Name:</label> <input type="text" name="firstName" value="${user.firstName}"><br>
		<label class="pad_top">Last Name:</label> <input type="text"
			name="lastName" value="${user.lastName}"><br> <label>&nbsp;</label>
		<input type="submit" value="Submit" class="btn">
	</form>
</div>
<%@ include file="/includes/footer.jsp"%>