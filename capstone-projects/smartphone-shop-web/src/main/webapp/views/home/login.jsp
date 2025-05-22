<%@ include file="/views/includes/header.jsp"%>
<div class="container mt-5 mb-5 d-flex justify-content-center">
	<div class="card" style="width: 30rem;">
		<div class="card-header text-center text-bg-success mb-5">Login</div>
		<div class="card-body">
			<c:if test="${error != null}">
				<div class="alert alert-danger mb-3" role="alert">${error}</div>
			</c:if>
			<form action="login" method="post">
				<div class="mb-3">
					<label class="form-label"><b>Email Address:</b></label> <input
						type="email" name="email" class="form-control"
						placeholder="name@example.com" required>
				</div>
				<div class="mb-3">
					<label class="form-label"><b>Password:</b></label><input
						type="password" name="password" id="password" class="form-control"
						required>
				</div>
				<div class="form-check form-switch mb-3">
					<input class="form-check-input" type="checkbox" role="switch"
						id="showpass" onclick="showPassword()"> <label
						class="form-check-label" for="showpass">Show Password</label>
				</div>
				<div class="form-check form-switch mb-3">
					<input name="remember" class="form-check-input" type="checkbox"
						role="switch" id="rememberme"> <label
						class="form-check-label" for="rememberme">Remember Me</label>
				</div>
				<div class="text-center mb-3">
					<button type="submit" class="btn btn-primary">Submit</button>
				</div>
			</form>
			<div class="card-footer">
				<a href="${pageContext.servletContext.contextPath}/forgotpassword"
					class="link-body-emphasis link-underline-opacity-25 link-underline-opacity-75-hover">Forgot
					Password?</a>
			</div>
		</div>
	</div>
</div>
<%@ include file="/views/includes/footer.jsp"%>