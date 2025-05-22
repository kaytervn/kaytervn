<%@ include file="/views/includes/header.jsp"%>
<div class="container mt-5 mb-5 d-flex justify-content-center">
	<div class="card" style="width: 30rem;">
		<div class="card-header text-center text-bg-success mb-5">Sign
			Up</div>
		<div class="card-body">
			<c:if test="${error != null}">
				<div class="alert alert-danger mb-3" role="alert">${error}</div>
			</c:if>
			<form action="register" method="post">
				<div class="mb-3">
					<label class="form-label"><b>Full Name:</b></label> <input
						type="text" name="name" class="form-control" required>
				</div>
				<div class="mb-3">
					<label class="form-label"><b>Email Address:</b></label> <input
						type="email" name="email" class="form-control"
						placeholder="name@example.com" required>
				</div>
				<div class="mb-3">
					<label class="form-label"><b>Password:</b></label> <input
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
					<button type="submit" class="btn btn-primary">Next</button>
				</div>
			</form>
		</div>
	</div>
</div>
<%@ include file="/views/includes/footer.jsp"%>