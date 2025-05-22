<%@ include file="/views/includes/header.jsp"%>
<div class="untree_co-section">
	<div class="container">
		<div class="row">
			<div class="col-auto">
				<div class="card" style="width: 30rem;">
					<c:if test="${not empty requestScope.user.image}">
						<img src="${requestScope.user.image}"
							class="card-img-top mx-auto w-50" style="border-radius: 50%;">
					</c:if>
					<div class="card-header text-center text-bg-success mb-5">User
						Profile</div>
					<div class="card-body">
						<div class="row align-items-center mb-3">
							<div class="col-3">
								<label class="form-label"><b>ID:</b></label>
							</div>
							<div class="col">${requestScope.user.id}</div>
						</div>
						<div class="row align-items-center mb-3">
							<div class="col-3">
								<label class="form-label"><b>Name:</b></label>
							</div>
							<div class="col">${requestScope.user.name}</div>
						</div>
						<div class="row align-items-center mb-3">
							<div class="col-3">
								<label class="form-label"><b>Role:</b></label>
							</div>
							<div class="col">${requestScope.user.role}</div>
						</div>
						<div class="row align-items-center mb-3">
							<div class="col-3">
								<label class="form-label"><b>Status:</b></label>
							</div>
							<div class="col">${requestScope.user.status}</div>
						</div>
						<div class="row align-items-center mb-3">
							<div class="col-3">
								<label class="form-label"><b>Email:</b></label>
							</div>
							<div class="col">${requestScope.user.email}</div>
						</div>
						<div class="row align-items-center mb-3">
							<div class="col-3">
								<label class="form-label"><b>Birth Date:</b></label>
							</div>
							<div class="col">${requestScope.user.birthdate}</div>
						</div>
						<div class="row align-items-center mb-3">
							<div class="col-3">
								<label class="form-label"><b>Gender:</b></label>
							</div>
							<div class="col">${requestScope.user.gender}</div>
						</div>
						<div class="row align-items-center mb-3">
							<div class="col-3">
								<label class="form-label"><b>Phone:</b></label>
							</div>
							<div class="col">${requestScope.user.phoneNumber}</div>
						</div>
						<div class="row align-items-center mb-3">
							<div class="col-3">
								<label class="form-label"><b>Password:</b></label>
							</div>
							<div class="col">
								<input type="password" readonly class="form-control-plaintext"
									id="password" value="${requestScope.user.password}">
							</div>
						</div>
						<div class="form-check form-switch mb-3">
							<input class="form-check-input" type="checkbox" role="switch"
								id="showpass" onclick="showPassword()"> <label
								class="form-check-label" for="showpass">Show Password</label>
						</div>
						<div class="text-center mb-3">
							<form action="updateUser" method="get">
								<input type="hidden" name="id" value="${requestScope.user.id }">
								<input type="submit" class="btn btn-primary" value="Edit">
							</form>
						</div>
					</div>
				</div>
			</div>
			<div class="col-auto">
				<h5 class="text-center">User Orders</h5>
				<table>
					<thead>
						<tr>
							<th>ID</th>
							<th>Date</th>
							<th>Address</th>
							<th>Phone</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						<c:forEach var="item" items="${listOrder}">
							<tr>
								<td><c:out value="${item.id}" /></td>
								<td><c:out value="${item.date}" /></td>
								<td><c:out value="${item.address}" /></td>
								<td><c:out value="${item.phone}" /></td>
								<td>
									<form action="viewOrder" method="post">
										<input type="hidden" name="id" value="${item.id}"> <input
											type="submit" value="View">
									</form>
								</td>
							</tr>
						</c:forEach>
					</tbody>
				</table>
			</div>
		</div>
	</div>
</div>
<%@ include file="/views/includes/footer.jsp"%>