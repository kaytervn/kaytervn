<%@ include file="/views/includes/header.jsp"%>
<div class="untree_co-section before-footer-section">
	<div class="container d-flex justify-content-center">
		<div class="card" style="width: 30rem;">
			<div class="card-header text-center text-bg-success mb-5">Add
				Order</div>
			<div class="card-body">
				<form action="checkout" method="post">
					<div class="row align-items-center mb-3">
						<div class="col-3">
							<label class="form-label"><b>Email:</b></label>
						</div>
						<div class="col">
							<input readonly type="email" name="email" class="form-control"
								value="${sessionScope.account.email }">
						</div>
					</div>
					<div class="row align-items-center mb-3">
						<div class="col-3">
							<label class="form-label"><b>Address:</b></label>
						</div>
						<div class="col">
							<input type="text" name="address" class="form-control" required>
						</div>
					</div>
					<div class="row align-items-center mb-3">
						<div class="col-3">
							<label class="form-label"><b>Phone:</b></label>
						</div>
						<div class="col">
							<input type="text" name="phone" class="form-control"
								pattern="0[0-9]{9}" title="The phone number is invalid."
								required>
						</div>
					</div>
					<div class="text-center mb-3">
						<button type="submit" class="btn btn-primary">Check Out</button>
					</div>
				</form>
			</div>
		</div>
	</div>
</div>
<%@ include file="/views/includes/footer.jsp"%>