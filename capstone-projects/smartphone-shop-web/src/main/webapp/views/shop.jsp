<%@ include file="/views/includes/header.jsp"%>
<div class="untree_co-section product-section before-footer-section">
	<div class="container">
		<div class="row mb-5">
			<form action="search" method="post">
				<div class="container" role="search">
					<div class="row justify-content-center pt-2">
						<div class="col-6">
							<input class="form-control me-2" type="search"
								placeholder="Search" name="search" aria-label="Search"
								value="${search }">
						</div>
						<div class="col-auto">
							<button class="btn btn-outline-success" type="submit">Search</button>
						</div>
					</div>
				</div>
			</form>
		</div>
		<div class="row">
			<c:forEach var="product" items="${listProduct}">
				<div class="col-12 col-md-4 col-lg-3 mb-5">
					<form action="addToCart" method="post">
						<a class="product-item"
							<c:choose>
							    <c:when test="${product.quantity eq 0 }">
									href="#out-of-stock"
							    </c:when>
							    <c:otherwise>
									href="addToCart?product_id=${product.id}"
							    </c:otherwise>
							</c:choose>>
							<img src="${product.image}" class="img-fluid product-thumbnail w-75 h-75">
							<h3 class="product-title">${product.name }</h3> <strong
							class="product-price">${product.priceCurrencyFormat}</strong> <span
							class="icon-cross"> <img
								src="${pageContext.servletContext.contextPath}/images/cross.svg"
								class="img-fluid">
						</span>
						</a>
					</form>
					<div class="text-center pt-4">
						<form action="viewProduct" method="post">
							<button name="id"
								class="btn btn-sm btn-outline-black<c:if test="${product.quantity eq 0 }"> bg-danger</c:if>"
								type="submit" value="${product.id}">
								<c:choose>
									<c:when test="${product.quantity eq 0 }">
											Out of Stock!
								    </c:when>
									<c:otherwise>
											Details
								    </c:otherwise>
								</c:choose>
							</button>
						</form>
					</div>
				</div>
			</c:forEach>
		</div>
	</div>
	<form action="paging" method="post">
		<input type="hidden" name="search" value="${search }">
		<nav aria-label="Page navigation example">
			<ul class="pagination justify-content-center">
				<li
					class="page-item <c:if test="${currentPage eq 1}">disabled</c:if>"><button
						name="page" class="page-link" type="submit"
						value="${currentPage - 1}">Previous</button></li>
				<c:forEach var="pageNumber" begin="1" end="${numberOfPages}">
					<li
						class="page-item <c:if test="${currentPage eq pageNumber}">active</c:if>"><input
						name="page" class="page-link" type="submit" value="${pageNumber}" /></li>
				</c:forEach>
				<li
					class="page-item <c:if test="${currentPage eq numberOfPages}">disabled</c:if>"><button
						name="page" class="page-link" type="submit"
						value="${currentPage + 1}">Next</button></li>
			</ul>
		</nav>
	</form>
</div>
<%@ include file="/views/includes/footer.jsp"%>