<%@ include file="/includes/header.jsp"%>
<div id="mainCSS">
	<h1>Update User</h1>
	<p>
		<a href="userAdmin">Return</a>
	</p>
	<p>NOTE: You can't update the email address.</p>
	<form action="userAdmin" method="post">
		<input type="hidden" name="action" value="update_user"> <label
			class="pad_top">Email:</label> <input type="email" name="email"
			value="${user.email}" disabled><br> <label
			class="pad_top">First Name:</label> <input type="text"
			name="firstName" value="${user.firstName}" required><br>
		<label class="pad_top">Last Name:</label> <input type="text"
			name="lastName" value="${user.lastName}" required><br> <label>&nbsp;</label>
		<input type="submit" value="Update" class="btn">
	</form>
</div>
<%@ include file="/includes/footer.jsp"%>