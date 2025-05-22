<%@ include file="/includes/header.jsp"%>
<div id="mainCSS">
	<h1>Your cart</h1>
	<table id="myTable">
		<tr class="header">
			<th>Quantity</th>
			<th>Description</th>
			<th>Price</th>
			<th>Amount</th>
			<th></th>
		</tr>

		<c:forEach var="item" items="${cart.items}">
			<tr>
				<td>
					<form action="" method="post">
						<input type="hidden" name="productCode"
							value="<c:out value='${item.product.code}'/>"> <input
							type=text name="quantity"
							value="<c:out value='${item.quantity}'/>" id="quantity">
						<input type="submit" value="Update" class="btn">
					</form>
				</td>
				<td><c:out value='${item.product.description}' /></td>
				<td><c:out value='${item.product.priceCurrencyFormat}' /></td>
				<td><c:out value='${item.totalCurrencyFormat}' /></td>
				<td>
					<form action="" method="post">
						<input type="hidden" name="productCode"
							value="<c:out value='${item.product.code}'/>"> <input
							type="hidden" name="quantity" value="0"> <input
							type="submit" value="Remove Item" class="btn">
					</form>
				</td>
			</tr>
		</c:forEach>
	</table>

	<p>
		<b>To change the quantity</b>, enter the new quantity and click on the
		Update button.
	</p>
	<div id="center">
		<form action="index.jsp" method="post">
			<input type="submit" value="Continue Shopping" class="btn">
		</form>
		<form action="checkout.jsp" method="post">
			<input type="submit" value="Checkout" class="btn">
		</form>
	</div>
</div>
<%@ include file="/includes/footer.jsp"%>
