<%@ include file="/views/includes/header.jsp"%>
<div class="untree_co-section product-section before-footer-section">
	<div class="container text-center">
		<h5>User Manager</h5>
		<table>
			<thead>
				<tr>
					<th>ID</th>
					<th>Name</th>
					<th>Role</th>
					<th>Status</th>
					<th>Email</th>
					<th>Birth Date</th>
					<th>Gender</th>
					<th>Phone</th>
					<th>Image</th>
					<th>Password</th>
					<th></th>
					<th></th>
					<th></th>
				</tr>
			</thead>
			<tbody>
				<c:forEach var="userItem" items="${listUser}">
					<tr>
						<td><c:out value="${userItem.id}" /></td>
						<td><c:out value="${userItem.name}" /></td>
						<td><c:out value="${userItem.role}" /></td>
						<td><c:out value="${userItem.status}" /></td>
						<td><c:out value="${userItem.email}" /></td>
						<td><c:out value="${userItem.birthdate}" /></td>
						<td><c:out value="${userItem.gender}" /></td>
						<td><c:out value="${userItem.phoneNumber}" /></td>
						<td><c:if test="${not empty userItem.image}">
								<img src="${userItem.image}" style="border-radius: 50%;"
									width="40" height="40">
							</c:if></td>
						<td><c:out value="${userItem.password}" /></td>
						<td>
							<form action="viewUser" method="get">
								<input type="hidden" name="id" value="${userItem.id}"> <input
									type="submit" value="View">
							</form>
						</td>
						<td>
							<form action="updateUser" method="get">
								<input type="hidden" name="id" value="${userItem.id}"> <input
									type="submit" value="Edit">
							</form>
						</td>
						<td>
							<form action="deleteUser" method="post">
								<input type="hidden" name="id" value="${userItem.id}"> <input
									type="submit" value="Delete">
							</form>
						</td>
					</tr>
				</c:forEach>
			</tbody>
		</table>
	</div>
</div>
<%@ include file="/views/includes/footer.jsp"%>
