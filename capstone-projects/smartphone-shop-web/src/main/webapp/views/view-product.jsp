<%@ include file="/views/includes/header.jsp"%>
<div class="untree_co-section product-section before-footer-section">
	<div class="container d-flex justify-content-center">
		<form action="addToCart" method="post">
			<input type="hidden" name="product_id" value="${product.id }">
			<div class="row">
				<div class="card" style="width: 20rem;">
					<c:if test="${not empty requestScope.product.image}">
						<img src="${requestScope.product.image}"
							class="card-img-top mx-auto w-75 m-5">
					</c:if>
					<div class="card-body">
						<div class="row align-items-center mb-3">
							<ul class="list-group list-group-flush">
								<li class="list-group-item"><h5>
										<b>${requestScope.product.name}</b>
									</h5></li>
								<li class="list-group-item"><b>Price: </b>${requestScope.product.priceCurrencyFormat}
								</li>
							</ul>
						</div>
					</div>
					<div class="card-footer">
						<div class="row align-items-center mb-3">
							<p class="list-group-item">
								<b>Quantity: </b>${requestScope.product.quantity}
							</p>
						</div>
					</div>
				</div>
				<div class="card" style="width: 20rem;">
					<div class="card-body">
						<div class="row align-items-center mb-3">
							<ul class="list-group list-group-flush">
								<li class="list-group-item"><b>Brand: </b>${requestScope.brand.name}</li>
								<li class="list-group-item"><b>Storage: </b>${requestScope.product.storage}
									GB</li>
								<li class="list-group-item"><b>RAM: </b>${requestScope.product.ram}
									GB</li>
								<li class="list-group-item"><b>OS: </b>${requestScope.product.os}</li>
								<li class="list-group-item"><b>Description: </b></li>
							</ul>
							<p class="cart-text">${requestScope.product.description}</p>
						</div>
					</div>
					<div class="card-footer">
						<div class="row align-items-center mb-3">
							<c:choose>
								<c:when test="${requestScope.product.quantity eq 0 }">
									<input class="btn btn-danger" value="Out of Stock!">
								</c:when>
								<c:otherwise>
									<input type="submit" class="btn btn-primary"
										value="Add to cart">
								</c:otherwise>
							</c:choose>
						</div>
					</div>
				</div>
			</div>
		</form>
	</div>
</div>
<%@ include file="/views/includes/footer.jsp"%>
