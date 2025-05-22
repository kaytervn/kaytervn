<%@ include file="/includes/header.jsp"%>
<div id="mainCSS">
	<h1>Downloads</h1>
	<h2>86 (the band) - True Life Songs and Pictures</h2>
	<table border="1">
		<tr>
			<th>Song title</th>
			<th>Audio Format</th>
		</tr>
		<tr>
			<td>You Are a Star</td>
			<td><a href="../ex7-1/musicStore/sound/${productCode}/star.mp3">MP3</a>
			</td>
		</tr>
		<tr>
			<td>Don't Make No Difference</td>
			<td><a
				href="../ex7-1/musicStore/sound/${productCode}/no_difference.mp3">MP3</a>
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