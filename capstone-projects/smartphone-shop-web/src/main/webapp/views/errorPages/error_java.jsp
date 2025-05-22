<%@ include file="/views/includes/header.jsp"%>
<div class="container text-center mt-5 mb-5">
	<img src="${pageContext.servletContext.contextPath}/images/error.png"
		alt="Error"><br>
	<h1>Java Error</h1>
	<p>Sorry, Java has thrown an exception.</p>
	<p>To continue, click the Back button.</p>
	<h2>Details</h2>
	<p>Type: ${pageContext.exception["class"]}</p>
	<p>Message: ${pageContext.exception.message}</p>
</div>
<%@ include file="/views/includes/footer.jsp"%>
