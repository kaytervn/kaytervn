<%@ include file="/views/includes/header.jsp"%>
<div class="container mt-5 mb-5 d-flex justify-content-center">
	<div class="card" style="width: 50rem;">
		<c:if test="${not empty requestScope.user.image}">
			<img src="${requestScope.user.image}"
				class="card-img-top mx-auto w-25" style="border-radius: 50%;">
		</c:if>
		<div class="card-header text-center text-bg-success mb-5">Edit
			User</div>
		<div class="card-body">
			<form action="editprofile" method="post"
				enctype="multipart/form-data">
				<div class="row align-items-center mb-3">
					<div class="col-3">
						<label class="form-label"><b>Name:</b></label>
					</div>
					<div class="col">
						<input type="text" name="name" class="form-control"
							value="${requestScope.user.name }" required>
					</div>
				</div>
				<div class="row align-items-center mb-3">
					<div class="col-3">
						<label class="form-label"><b>Role:</b></label>
					</div>
					<div class="col">
						<input type="radio" class="btn-check" name="role" id="User"
							autocomplete="off" value="user" disabled
							<c:if test="${requestScope.user.role eq 'USER' }">checked</c:if>>
						<label class="btn btn-outline-primary w-100" for="User">USER</label>
					</div>
					<div class="col">
						<input type="radio" class="btn-check" name="role" id="Admin"
							autocomplete="off" value="admin" disabled
							<c:if test="${requestScope.user.role eq 'ADMIN' }">checked</c:if>>
						<label class="btn btn-outline-primary w-100" for="Admin">ADMIN</label>
					</div>
				</div>
				<div class="row align-items-center mb-3">
					<div class="col-3">
						<label class="form-label"><b>Status:</b></label>
					</div>
					<div class="col">
						<input type="radio" class="btn-check" name="status" id="active"
							autocomplete="off" value="active" disabled
							<c:if test="${requestScope.user.status eq 'ACTIVE' }">checked</c:if>>
						<label class="btn btn-outline-success w-100" for="active">ACTIVE</label>
					</div>
					<div class="col">
						<input type="radio" class="btn-check" name="status" id="Inactive"
							autocomplete="off" value="inactive" disabled
							<c:if test="${requestScope.user.status eq 'INACTIVE' }">checked</c:if>>
						<label class="btn btn-outline-danger w-100" for="Inactive">INACTIVE</label>
					</div>
				</div>
				<div class="row align-items-center mb-3">
					<div class="col-3">
						<label class="form-label"><b>Email:</b></label>
					</div>
					<div class="col">
						<input readonly type="email" name="email" class="form-control"
							value="${requestScope.user.email }">
					</div>
				</div>
				<div class="row align-items-center mb-3">
					<div class="col-3">
						<label class="form-label"><b>Image:</b></label>
					</div>
					<div class="col">
						<input class="form-control" type="file" name="image">
					</div>
				</div>
				<div class="row align-items-center mb-3">
					<div class="col-3">
						<label class="form-label"><b>Birth Date:</b></label>
					</div>
					<div class="col">
						<input type="date" name="birthdate" class="form-control"
							value="${requestScope.user.birthdate }">
					</div>
				</div>
				<div class="row align-items-center mb-3">
					<div class="col-3">
						<label class="form-label"><b>Gender:</b></label>
					</div>
					<div class="col">
						<input type="radio" class="btn-check" name="gender" id="male"
							autocomplete="off" value="male"
							<c:if test="${requestScope.user.gender eq 'MALE' }">checked</c:if>>
						<label class="btn btn-outline-primary w-100" for="male">MALE</label>
					</div>
					<div class="col">
						<input type="radio" class="btn-check" name="gender" id="female"
							autocomplete="off" value="female"
							<c:if test="${requestScope.user.gender eq 'FEMALE' }">checked</c:if>>
						<label class="btn btn-outline-primary w-100" for="female">FEMALE</label>
					</div>
					<div class="col">
						<input type="radio" class="btn-check" name="gender" id="unknown"
							autocomplete="off" value="unknown"
							<c:if test="${requestScope.user.gender eq 'UNKNOWN' }">checked</c:if>>
						<label class="btn btn-outline-danger w-100" for="unknown">UNKNOWN</label>
					</div>
				</div>
				<div class="row align-items-center mb-3">
					<div class="col-3">
						<label class="form-label"><b>Phone:</b></label>
					</div>
					<div class="col">
						<input type="text" name="phoneNumber" class="form-control"
							pattern="0[0-9]{9}" title="The phone number is invalid."
							value="${requestScope.user.phoneNumber }">
					</div>
				</div>
				<div class="row align-items-center mb-3">
					<div class="col-3">
						<label class="form-label"><b>Password:</b></label>
					</div>
					<div class="col">
						<input type="password" name="password" class="form-control"
							pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$"
							title="The password must contain at least 8 characters, including at least ONE LETTER and ONE NUMBER."
							value="${requestScope.user.password }" required id="password">
					</div>
				</div>
				<div class="form-check form-switch mb-3">
					<input class="form-check-input" type="checkbox" role="switch"
						id="showpass" onclick="showPassword()"> <label
						class="form-check-label" for="showpass">Show Password</label>
				</div>
				<div class="text-center mb-3">
					<button type="submit" class="btn btn-primary">Edit</button>
				</div>
			</form>
		</div>
	</div>
</div>
<%@ include file="/views/includes/footer.jsp"%>