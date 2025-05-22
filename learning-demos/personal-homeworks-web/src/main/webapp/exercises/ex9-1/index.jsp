<%@ include file="/includes/header.jsp"%>
<div id="mainCSS">
	<c:if test="${cookie.userEmail.value != null}">
		<p>
			<b>User Email:</b>
			<c:out value='${cookie.userEmail.value}' />
		</p>
	</c:if>

	<c:if test="${cookie.firstNameCookie.value != null}">
		<p>
			Welcome back,
			<c:out value='${cookie.firstNameCookie.value}' />
			!
		</p>
	</c:if>

	<h1>List of albums</h1>
	<p>
		<a href="download?action=checkUser&amp;productCode=8601"> 86 (the
			band) - True Life Songs and Pictures </a><br> <br> <a
			href="download?action=checkUser&amp;productCode=pf01"> Paddlefoot
			- The First CD </a><br> <br> <a
			href="download?action=checkUser&amp;productCode=pf02"> Paddlefoot
			- The Second CD </a><br> <br> <a
			href="download?action=checkUser&amp;productCode=jr01"> Joe Rut -
			Genuine Wood Grained Finish </a>
	</p>
</div>
<%@ include file="/includes/footer.jsp"%>