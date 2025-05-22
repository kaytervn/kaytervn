<%@ include file="/includes/header.jsp"%>
<div id="mainCSS">
	<h1>Cookies</h1>
	<p>Here's a table with all of the cookies that this browser is
		sending to the current server.</p>
	<table border="1">
		<tr>
			<th>Name</th>
			<th>Value</th>
		</tr>
		<c:forEach var="c" items="${cookie}">
			<tr>
				<td>${c.value.name}</td>
				<td>${c.value.value}</td>
			</tr>
		</c:forEach>
	</table>
	<br> <a href="download?action=deleteCookies">Delete All
		Persistent Cookies</a> <br> <br> <label>&nbsp;</label>
	<form action="download" method="get">
		<input type="hidden" name="action" value="checkUser"> <input
			type="hidden" name="productCode" value="${sessionScope.productCode}">
		<input type="submit" value="Return" class="btn">
	</form>
</div>
<%@ include file="/includes/footer.jsp"%>
