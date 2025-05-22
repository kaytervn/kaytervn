<%@ include file="/includes/header.jsp"%>
<div id="mainCSS">

	<c:if test="${sqlStatement == null}">
		<c:set var="sqlStatement" value="select * from User" />
	</c:if>
	<h1>The SQL Gateway</h1>
	<p>Enter an SQL statement and click the Execute button.</p>
	<p>
		<b>SQL statement:</b>
	</p>
	<form action="sqlGateway" method="post">
		<textarea name="sqlStatement" cols="60" rows="8"> ${sqlStatement}</textarea>
		<input type="submit" value="Execute">
	</form>
	<p>
		<b>SQL result:</b>
	</p>
	${sqlResult}

</div>
<%@ include file="/includes/footer.jsp"%>