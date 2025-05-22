<%@ include file="/views/includes/header.jsp"%>
<div class="container mt-5 mb-5 d-flex justify-content-center">
	<div class="card" style="width: 50rem;">
		<div class="card-header text-center text-bg-success mb-5">Edit
			Brand</div>
		<div class="card-body">
			<form action="updateBrand" method="post">
				<div class="row align-items-center mb-3">
					<div class="col-3">
						<label class="form-label"><b>ID:</b></label>
					</div>
					<div class="col">
						<input readonly type="text" name="id" class="form-control"
							value="${requestScope.brand.id}">
					</div>
				</div>
				<div class="row align-items-center mb-3">
					<div class="col-3">
						<label class="form-label"><b>Name:</b></label>
					</div>
					<div class="col">
						<input class="form-control" list="brandList" name="name"
							placeholder="Type to search..."
							value="${requestScope.brand.name }" required>
						<datalist id="brandList">
							<option value="Apple">
							<option value="Samsung">
							<option value="Xiaomi">
							<option value="Huawei">
							<option value="OnePlus">
							<option value="Google">
							<option value="OPPO">
							<option value="Vivo">
							<option value="Realme">
							<option value="Motorola">
						</datalist>
					</div>
				</div>
				<div class="row align-items-center mb-3">
					<div class="col-3">
						<label class="form-label"><b>Country:</b></label>
					</div>
					<div class="col">
						<input class="form-control" list="countryListOption"
							name="country" placeholder="Type to search..."
							value="${requestScope.brand.country}" required>
						<datalist id="countryListOption">
							<option value="United States">
							<option value="China">
							<option value="India">
							<option value="Japan">
							<option value="Germany">
							<option value="Singapore">
							<option value="South Korea">
							<option value="Sweden">
							<option value="Switzerland">
							<option value="United Kingdom">
							<option value="Vietnam">
							<option value="Israel">
						</datalist>
					</div>
				</div>
				<div class="text-center mb-3">
					<button type="submit" class="btn btn-primary">Edit</button>
				</div>
			</form>
		</div>
	</div>
</div>
<%@ include file="/views/includes/footer.jsp"%>