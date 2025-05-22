<%@ include file="/includes/header.jsp"%>
<div id="mainCSS">
	<h1>Test Servlet</h1>
	<p>
		<b>1. </b>Click the Join Now button to run the test servlet. This
		should show that the test servlet works for the <b>HTTP POST</b>
		method.
	</p>
	<p>
		<b>2. </b>Enter the /test URL into the browser to run the test
		servlet. This should show that the test servlet works for the <b>HTTP
			GET</b> method.
	</p>
	<p>
		<i><b>Ex:</b> ../exercises/ex5-2/test</i>
	</p>
	<label>&nbsp;</label>
	<form action="test" method="post">
		<input type="submit" value="Join Now" class="btn">
	</form>
</div>
<%@ include file="/includes/footer.jsp"%>