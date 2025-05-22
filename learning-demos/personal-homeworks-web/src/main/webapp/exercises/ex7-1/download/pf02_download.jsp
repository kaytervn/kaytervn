<%@ include file="/includes/header.jsp"%>
<div id="mainCSS">
	<h1>Downloads</h1>
	<h2>Paddlefoot - The Second CD</h2>
	<table border="1">
		<tr>
			<th>Song title</th>
			<th>Audio Format</th>
		</tr>
		<tr>
			<td>Pete And Jimmy</td>
			<td><a
				href="../ex7-1/musicStore/sound/${productCode}/pete_n_jimmy.mp3">MP3</a>
			</td>
		</tr>
		<tr>
			<td>Rock And Roll Scene</td>
			<td><a
				href="../ex7-1/musicStore/sound/${productCode}/rock_n_roll_scene.mp3">MP3</a>
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
