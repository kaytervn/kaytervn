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
		<tr>
			<td>86 (the band) - True Life Songs and Pictures</td>
			<td class="right">$14.95</td>
			<td><form action="cart" method="post">
					<input type="hidden" name="action" value="add"> <input
						type="hidden" name="productCode" value="8601"> <input
						type="submit" value="Add To Cart" class="btn">
				</form></td>
		</tr>
		<tr>
			<td>Paddlefoot - The first CD</td>
			<td class="right">$12.95</td>
			<td><form action="cart" method="post">
					<input type="hidden" name="action" value="add"> <input
						type="hidden" name="productCode" value="pf01"> <input
						type="submit" value="Add To Cart" class="btn">
				</form></td>
		</tr>
		<tr>
			<td>Paddlefoot - The second CD</td>
			<td class="right">$14.95</td>
			<td><form action="cart" method="post">
					<input type="hidden" name="action" value="add"> <input
						type="hidden" name="productCode" value="pf02"> <input
						type="submit" value="Add To Cart" class="btn">
				</form></td>
		</tr>
		<tr>
			<td>Joe Rut - Genuine Wood Grained Finish</td>
			<td class="right">$14.95</td>
			<td><form action="cart" method="post">
					<input type="hidden" name="action" value="add"> <input
						type="hidden" name="productCode" value="jr01"> <input
						type="submit" value="Add To Cart" class="btn">
				</form></td>
		</tr>
	</table>
</div>
<%@ include file="/includes/footer.jsp"%>
