<%@ include file="/includes/header.jsp"%>
<div id="mainCSS">
	<label>&nbsp;</label> <img src="../../images/murachlogo.jpg"
		alt="Murach Logo" width="100" style="border-radius: 20px;"> <br>
	<label>&nbsp;</label>
	<h1>Survey</h1>
	<p>If you have a moment, we'd appreciate it if you would fill out
		this survey.</p>
	<h2>Your information</h2>
	<form action="infoSurvey" method="post">
		<input type="hidden" name="action" value="add"> <label>First
			Name:</label> <input type="text" name="firstName" required><br>
		<label>Last Name:</label> <input type="text" name="lastName" required><br>
		<label>Email:</label> <input type="text" name="email" required><br>
		<label>Date Of Birth:</label> <input type="date" name="date"><br>

		<h2>How did you hear about us?</h2>
		<p>
			<input type="radio" name="heardFrom" value="Search Engine" checked>Search
			Engine <input type="radio" name="heardFrom" value="Word of Mouth">Word
			of Mouth <input type="radio" name="heardFrom" value="Social Media">Social
			Media <input type="radio" name="heardFrom" value="Other">Other
		</p>

		<h2>Would you like to receive announcements about new CDs and
			special offers?</h2>
		<input type="checkbox" name="updateOK" value="Yes">YES, I'd
		like that.<br> <input type="checkbox" name="emailOK" value="Yes">YES,
		please send me email announcements.<br>

		<p>
			Please contact me by: <select name="contactVia">
				<option value="Email" selected>Email</option>
				<option value="Postal Mail">Postal Mail</option>
				<option value="Email or Postal Mail">Email or Postal Mail</option>
			</select>
		</p>
		<label>&nbsp;</label> <input type="submit" value="Submit" id="submit"
			class="btn">
	</form>
</div>
<%@ include file="/includes/footer.jsp"%>