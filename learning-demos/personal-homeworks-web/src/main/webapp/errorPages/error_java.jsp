<%@ include file="/includes/header.jsp"%>
<div id="mainCSS">
	<div id="center">
		<img src="${pageContext.servletContext.contextPath}/images/tired.png"
			alt="Very Sad Sticker">
		<h1>Java Error</h1>
		<p>Sorry, Java has thrown an exception.</p>
		<p>To continue, click the Back button.</p>

		<h2>Details</h2>
		<p>Type: (pageContext.exception["class"]}</p>
		<p>Message: {pageContext.exception.message}</p>
	</div>
</div>
<%@ include file="/includes/footer.jsp"%>
