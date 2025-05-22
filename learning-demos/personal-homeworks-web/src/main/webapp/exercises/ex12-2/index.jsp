<%@ include file="/includes/header.jsp"%>
<div id="mainCSS">

	<h1>Users</h1>

	<table>

		<tr>
			<th>First Name</th>
			<th>Last Name</th>
			<th colspan="3">Email Address</th>
		</tr>

		<c:forEach var="user" items="${users}">
			<tr>
				<td>${user.firstName}</td>
				<td>${user.lastName}</td>
				<td>${user.email}</td>
				<td><a
					href="userAdmin?action=display_user&amp;email=${user.email}">Update</a></td>
				<td><a
					href="userAdmin?action=delete_user&amp;email=${user.email}">Delete</a></td>
			</tr>
		</c:forEach>

	</table>

	<p>
		<a href="userAdmin">Refresh</a>
	</p>
</div>
<%@ include file="/includes/footer.jsp"%>