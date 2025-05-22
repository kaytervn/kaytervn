<%@ include file="/views/includes/header.jsp"%>
<div class="untree_co-section product-section before-footer-section">
	<div class="container text-center">
		<h5>Order Detail</h5>
		<table>
			<thead>
				<tr>
					<th>ID</th>
					<th>Product Name</th>
					<th>Price</th>
					<th>Storage</th>
					<th>RAM</th>
					<th>OS</th>
					<th>Quantity</th>
					<th>Total</th>
				</tr>
			</thead>
			<tbody>
				<c:forEach var="item" items="${listOrderDetail}">
					<tr>
						<td><c:out value="${item.id}" /></td>
						<c:forEach var="product" items="${listProduct}">
							<c:if test="${item.product.id eq product.id}">
								<td><c:out value="${product.name}" /></td>
								<td><c:out value="${product.priceCurrencyFormat}" /></td>
								<td><c:out value="${product.storage}" /></td>
								<td><c:out value="${product.ram}" /></td>
								<td><c:out value="${product.os}" /></td>
								<td><c:out value="${item.quantity}" /></td>
								<td><c:out value="${item.quantity * product.price}" /></td>
							</c:if>
						</c:forEach>
					</tr>
				</c:forEach>
			</tbody>
		</table>
	</div>
</div>
<%@ include file="/views/includes/footer.jsp"%>
