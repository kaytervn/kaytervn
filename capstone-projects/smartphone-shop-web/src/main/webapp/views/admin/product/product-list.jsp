<%@ include file="/views/includes/header.jsp"%>
<div class="untree_co-section product-section before-footer-section">
	<div class="container text-center">
		<h5>Product Manager</h5>
		<table>
			<thead>
				<tr>
					<th>ID</th>
					<th>Brand</th>
					<th>Name</th>
					<th>Image</th>
					<th>Price</th>
					<th>Storage</th>
					<th>Ram</th>
					<th>OS</th>
					<th>Description</th>
					<th>Quantity</th>
					<th></th>
					<th></th>
				</tr>
			</thead>
			<tbody>
				<c:forEach var="product" items="${listProduct}">
					<tr>
						<td><c:out value="${product.id}" /></td>
						<td><c:forEach var="brand" items="${listBrand}">
								<c:if test="${brand.id eq product.brand.id}">
									<c:out value="${brand.name}" />
								</c:if>
							</c:forEach></td>
						<td><c:out value="${product.name}" /></td>
						<td><c:if test="${not empty product.image}">
								<img src="${product.image}" style="border-radius: 50%;"
									width="50" height="50">
							</c:if></td>
						<td><c:out value="${product.priceCurrencyFormat}" /></td>
						<td><c:out value="${product.storage}" /></td>
						<td><c:out value="${product.ram}" /></td>
						<td><c:out value="${product.os}" /></td>
						<td><c:out value="${product.description}" /></td>
						<td><c:out value="${product.quantity}" /></td>
						<td>
							<form action="updateProduct" method="get">
								<input type="hidden" name="id" value="${product.id}"> <input
									type="submit" value="Edit">
							</form>
						</td>
						<td>
							<form action="deleteProduct" method="post">
								<input type="hidden" name="id" value="${product.id}"> <input
									type="submit" value="Delete">
							</form>
						</td>
					</tr>
				</c:forEach>
			</tbody>
		</table>
		<form action="addProduct" method="get">
			<input class="btn btn-primary" type="submit" value="Add">
		</form>
	</div>
</div>
<%@ include file="/views/includes/footer.jsp"%>
