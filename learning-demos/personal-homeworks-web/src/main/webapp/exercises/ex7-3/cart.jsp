<%@ include file="/includes/header.jsp"%>
<div id="mainCSS">
	<h1>Your cart</h1>
	<table id=myTable>
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
					<form action="cart" method="post">
						<input type="hidden" name="productCode"
							value="${item.product.code}"> <input type=text
							name="quantity" value="${item.quantity}" id="quantity"> <input
							type="submit" value="Update" class="btn">
					</form>
				</td>
				<td>${item.product.description}</td>
				<td>${item.product.priceCurrencyFormat}</td>
				<td>${item.totalCurrencyFormat}</td>
				<td><a
					href="cart?productCode=${item.product.code}&amp;quantity=0">Remove
						Item</a></td>
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
