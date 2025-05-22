<%@ include file="/views/includes/header.jsp"%>
<div class="untree_co-section before-footer-section">
	<div class="container">
		<div class="row mb-5">
			<c:if test="${requestScope.error != null}">
				<div class="alert alert-danger mb-3" role="alert">${error}</div>
			</c:if>
			<h5>Cart</h5>
			<div class="site-blocks-table">
				<table>
					<thead>
						<tr>
							<th>Quantity</th>
							<th>Image</th>
							<th>Name</th>
							<th>OS</th>
							<th>Stock</th>
							<th>Price</th>
							<th>Total</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						<c:forEach var="item" items="${order.orderDetails}">
							<tr>
								<td>
									<form action="updateCart" method="post">
										<input type=text name="quantity" value='${item.quantity}'
											pattern="^[1-9]\d*$" title="Enter a valid number!" required>
										<input type="hidden" name="product_id"
											value="${item.product.id}"> <input type="submit"
											value="Update">
									</form>
								</td>
								<td><c:if test="${not empty item.product.image}">
										<img src="${item.product.image}" style="border-radius: 50%;"
											width="100" height="100">
									</c:if></td>
								<td><c:out value="${item.product.name}" /></td>
								<td><c:out value="${item.product.os}" /></td>
								<td><c:out value="${item.product.quantity}" /></td>
								<td><c:out value="${item.product.priceCurrencyFormat}" /></td>
								<td><c:out value="${item.totalCurrencyFormat}" /></td>
								<td>
									<form action="removeCart" method="post">
										<input type="hidden" name="product_id"
											value="${item.product.id}"> <input type="submit"
											value="Delete">
									</form>
								</td>
							</tr>
						</c:forEach>
					</tbody>
				</table>
			</div>

			<div class="row">
				<div class="col-md-6">
					<div class="row mb-5">
						<div class="col-md-6">
							<a class="btn btn-outline-black btn-sm btn-block"
								href="${pageContext.servletContext.contextPath}/shop">Continue
								Shopping</a>
						</div>
					</div>
				</div>
				<div class="col-md-6 pl-5">
					<div class="row justify-content-end">
						<div class="col-md-7">
							<div class="row">
								<div class="col-md-12 text-right border-bottom mb-5">
									<h3 class="text-black h4 text-uppercase">Cart Totals</h3>
								</div>
							</div>
							<div class="row mb-5">
								<div class="col-md-6">
									<span class="text-black">Total</span>
								</div>
								<div class="col-md-6 text-right">
									<strong class="text-black">${order.totalCurrencyFormat }</strong>
								</div>
							</div>

							<div class="row">
								<div class="col-md-12">
									<c:choose>
										<c:when test="${sessionScope.account != null}">
											<button class="btn btn-black btn-lg py-3 btn-block"
												onclick="window.location='checkout'">Proceed To
												Checkout</button>
										</c:when>
										<c:otherwise>
											<button class="btn btn-black btn-lg py-3 btn-block"
												onclick="window.location='login'">Login To Checkout</button>
										</c:otherwise>
									</c:choose>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
<%@ include file="/views/includes/footer.jsp"%>