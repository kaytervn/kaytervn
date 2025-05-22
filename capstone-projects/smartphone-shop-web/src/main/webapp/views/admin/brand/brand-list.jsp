<%@ include file="/views/includes/header.jsp"%>
<div class="untree_co-section product-section before-footer-section">
	<div class="container text-center">
		<h5>Brand Manager</h5>
		<table>
			<thead>
				<tr>
					<th>ID</th>
					<th>Name</th>
					<th>Country</th>
					<th></th>
					<th></th>
				</tr>
			</thead>
			<tbody>
				<c:forEach var="brand" items="${listBrand}">
					<tr>
						<td><c:out value="${brand.id}" /></td>
						<td><c:out value="${brand.name}" /></td>
						<td><c:out value="${brand.country}" /></td>
						<td>
							<form action="updateBrand" method="get">
								<input type="hidden" name="id" value="${brand.id}"> <input
									type="submit" value="Edit">
							</form>
						</td>
						<td>
							<form action="deleteBrand" method="post">
								<input type="hidden" name="id" value="${brand.id}"> <input
									type="submit" value="Delete">
							</form>
						</td>
					</tr>
				</c:forEach>
			</tbody>
		</table>
		<form action="addBrand" method="get">
			<input class="btn btn-primary" type="submit" value="Add">
		</form>
	</div>
</div>
<%@ include file="/views/includes/footer.jsp"%>
