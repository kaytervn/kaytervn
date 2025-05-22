<%@ include file="/includes/header.jsp"%>
<div id="mainCSS">
	<h1>Downloads</h1>
	<h2>Paddlefoot - The First CD</h2>
	<table border="1">
		<tr>
			<th>Song title</th>
			<th>Audio Format</th>
		</tr>
		<tr>
			<td>Armenian Wedding</td>
			<td><a
				href="../ex7-1/musicStore/sound/${product.code}/armenian_wedding.mp3">MP3</a>
			</td>
		</tr>
	</table>
	<br> <a href="download?action=viewCookies">View All Cookies</a> <br>
	<br> <label>&nbsp;</label>
	<form action="" method="get">
		<input type="hidden" name="action" value="viewAlbums"> <input
			type="submit" value="Return" class="btn">
	</form>
</div>
<%@ include file="/includes/footer.jsp"%>