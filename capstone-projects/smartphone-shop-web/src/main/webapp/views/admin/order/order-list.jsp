<%@ include file="/views/includes/header.jsp"%>
<div class="untree_co-section product-section before-footer-section">
	<div class="container text-center">
		<h5>Order Manager</h5>
		<table>
			<thead>
				<tr>
					<th>ID</th>
					<th>User Name</th>
					<th>Date</th>
					<th>Address</th>
					<th>Phone</th>
					<th></th>
				</tr>
			</thead>
			<tbody>
				<c:forEach var="item" items="${listOrder}">
					<tr>
						<td><c:out value="${item.id}" /></td>
						<td><c:forEach var="user" items="${listUser}">
								<c:if test="${item.user.id eq user.id}">
									<c:out value="${user.name}" />
								</c:if>
							</c:forEach></td>
						<td><c:out value="${item.date}" /></td>
						<td><c:out value="${item.address}" /></td>
						<td><c:out value="${item.phone}" /></td>
						<td>
							<form action="viewOrder" method="post">
								<input type="hidden" name="id" value="${item.id}"> <input
									type="submit" value="View">
							</form>
						</td>
					</tr>
				</c:forEach>
			</tbody>
		</table>
	</div>
</div>
<%@ include file="/views/includes/footer.jsp"%>
