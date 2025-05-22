<%@ include file="/includes/header.jsp"%>
<div id="mainCSS">
	<h1>CD list</h1>
	<input type="text" id="myInput" onkeyup="myFunction()"
		placeholder="Search for decriptions...">
	<table id="myTable">
		<tr class="header">
			<th>Description</th>
			<th class="right">Price</th>
			<th>&nbsp;</th>
		</tr>
		<c:forEach var="product" items="${products}">
			<tr>
				<td><c:out value='${product.description}' /></td>
				<td class="right">${product.priceCurrencyFormat}</td>
				<td><form action="cart" method="post">
						<input type="hidden" name="action" value="add"> <input
							type="hidden" name="productCode" value="${product.code}">
						<input type="submit" value="Add To Cart" class="btn">
					</form></td>
			</tr>
		</c:forEach>
	</table>
</div>
<%@ include file="/includes/footer.jsp"%>
