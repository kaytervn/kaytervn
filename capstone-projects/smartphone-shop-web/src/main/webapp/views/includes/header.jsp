<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<!DOCTYPE html>
<html>
<head>
<title>TechGadget</title>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width">
<link rel="icon"
	href="${pageContext.servletContext.contextPath}/images/icon.png">
<%@ include file="/views/includes/link.jsp"%>
</head>
<body>
	<nav
		class="custom-navbar navbar navbar navbar-expand-md navbar-dark bg-dark">
		<div class="container">
			<a class="navbar-brand" href="">TechGadget<span>.</span></a>
			<button class="navbar-toggler" type="button"
				data-bs-toggle="collapse" data-bs-target="#navbarsFurni"
				aria-controls="navbarsFurni" aria-expanded="false"
				aria-label="Toggle navigation">
				<span class="navbar-toggler-icon"></span>
			</button>
			<div class="collapse navbar-collapse" id="navbarsFurni">
				<ul class="custom-navbar-nav navbar-nav ms-auto mb-2 mb-md-0">
					<li class="nav-item"><a class="nav-link"
						href="${pageContext.servletContext.contextPath}/views/home.jsp">Home</a></li>
					<li class="nav-item"><a class="nav-link"
						href="${pageContext.servletContext.contextPath}/shop">Shop</a></li>
					<li class="nav-item"><a class="nav-link"
						href="${pageContext.servletContext.contextPath}/viewCart">Cart <span
							class="badge text-bg-danger">${fn:length(sessionScope.order.orderDetails)}</span><span
							class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning">${sessionScope.order.totalCurrencyFormat}</span></a></li>
					<c:if test="${sessionScope.account.role eq 'ADMIN'}">
						<li class="nav-item"><a class="nav-link"
							href="${pageContext.servletContext.contextPath}/listUser">User</a></li>
						<li class="nav-item"><a class="nav-link"
							href="${pageContext.servletContext.contextPath}/listBrand">Brand</a></li>
						<li class="nav-item"><a class="nav-link"
							href="${pageContext.servletContext.contextPath}/listProduct">Product</a></li>
						<li class="nav-item"><a class="nav-link"
							href="${pageContext.servletContext.contextPath}/listOrder">Order</a></li>
					</c:if>
				</ul>
				<ul class="custom-navbar-cta navbar-nav mb-2 mb-md-0 ms-5">
					<c:choose>
						<c:when test="${sessionScope.account != null}">
							<div style="padding-right: 5px;">
								<a class="btn"
									href="${pageContext.servletContext.contextPath}/profile"><c:if
										test="${not empty sessionScope.account.image}">
										<img src="${sessionScope.account.image}" alt="avatar"
											style="border-radius: 50%;" width="40" height="40">
									</c:if>${sessionScope.account.name}</a>
							</div>
							<div>
								<a class="btn"
									href="${pageContext.servletContext.contextPath}/logout">Logout</a>
							</div>
						</c:when>
						<c:otherwise>
							<div style="padding-right: 5px;">
								<a class="btn"
									href="${pageContext.servletContext.contextPath}/login">Login</a>
							</div>
							<div>
								<a class="btn"
									href="${pageContext.servletContext.contextPath}/register">Register</a>
							</div>
						</c:otherwise>
					</c:choose>
				</ul>
			</div>
		</div>
	</nav>