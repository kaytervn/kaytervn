<%@ include file="/views/includes/header.jsp"%>
<div class="container mt-5 mb-5 d-flex justify-content-center">
	<div class="card" style="width: 30rem;">
		<div class="card-header text-center text-bg-success mb-5">Verifying</div>
		<div class="card-body">
			<c:if test="${error != null}">
				<div class="alert alert-danger mb-3" role="alert">${error}</div>
			</c:if>
			<c:if test="${message != null}">
				<div class="alert alert-success mb-3" role="alert">${message}</div>
				<div class="text-center mb-3">
					<a class="btn btn-primary"
						href="${pageContext.servletContext.contextPath}/login"
						role="button">Login</a>
				</div>
			</c:if>

			<c:if test="${message == null}">
				<p class="card-title mb-3">
					<b>Confirm code has been sent to your email.</b>
				</p>
				<p class="card-text mb-3">Please check your email to reset your
					password!</p>
				<form action="resetpassword" method="post">
					<div class="mb-3">
						<label class="form-label"><b>Code:</b></label> <input type="text"
							name="authcode" class="form-control" required>
					</div>
					<div class="mb-3">
						<label class="form-label"><b>New Password:</b></label> <input
							type="password" name="password" class="form-control" required
							pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$"
							title="The password must contain at least 8 characters, including at least ONE LETTER and ONE NUMBER.">
					</div>
					<div class="mb-3">
						<label class="form-label"><b>Confirm Password:</b></label> <input
							type="password" name="confirmPassword" class="form-control"
							required>
					</div>
					<div class="text-center mb-3">
						<button type="submit" class="btn btn-primary">Submit</button>
					</div>
				</form>
			</c:if>
		</div>
	</div>
</div>
<%@ include file="/views/includes/footer.jsp"%>