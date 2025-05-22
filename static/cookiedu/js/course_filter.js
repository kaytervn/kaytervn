let listCard = document.getElementById("listCourse").querySelectorAll(".card");
let listPageNumber = document.querySelector(".pagination");

let listCourse = [];
let filterArray = [];

const itemsPerPage = 6;
let currentPage = 0;
let totalPages = Math.ceil(listCard.length / itemsPerPage);

listCard.forEach(function (card) {
  const id = card.querySelector("#courseId").innerText;
  const image = card.querySelector("#image").innerText;
  const courseName = card.querySelector("#courseName").innerText;
  const teacherName = card.querySelector("#teacherName").innerText;
  const level = card.querySelector("#level").innerText;
  const date = card.querySelector("#date").innerText;
  const price = card.querySelector("#price").innerText;
  const joined = card.querySelector("#joined").innerText;
  const reviews = card.querySelector("#reviews").innerText;
  const wishlisted = card.querySelector("#wishlisted").innerText;

  listCourse.push({
    id: id,
    image: image,
    courseName: courseName,
    teacherName: teacherName,
    level: level,
    date: date,
    price: price,
    joined: joined,
    reviews: reviews,
    wishlisted: wishlisted,
  });
});

updatePage();

function previousPage() {
  currentPage--;
  updatePage();
}

function nextPage() {
  currentPage++;
  updatePage();
}

function updateCurrentPage(num) {
  currentPage = num;
  updatePage();
}

function filterList() {
  let searchInput = document.getElementById("searchInput").value.toLowerCase();
  let sort = document.querySelector(".form-select").value;
  filterArray = listCourse.filter(function (item) {
    if (
      item.courseName.toLowerCase().includes(searchInput) ||
      item.teacherName.toLowerCase().includes(searchInput)
    ) {
      return item;
    }
  });

  filterArray.sort(function (a, b) {
    switch (sort) {
      case "mostWishlisted":
        return b.wishlisted - a.wishlisted;
      case "mostReviewed":
        return b.reviews - a.reviews;
      case "bestSellers":
        return b.joined - a.joined;
      case "newest":
        new Date(a.date) - new Date(b.date);
      case "oldest":
        new Date(b.date) - new Date(a.date);
      case "highestPrice":
        return b.price - a.price;
      case "lowestPrice":
        return a.price - b.price;
    }
  });
}

function updatePagination() {
  totalPages = Math.ceil(filterArray.length / itemsPerPage);
  listPageNumber.innerHTML = "";
  if (filterArray.length > 0) {
    listPageNumber.innerHTML += `<li class="page-item"><button class="page-link" onclick="previousPage()">Previous</button></li>`;

    if (totalPages <= 5) {
      for (let i = 0; i < totalPages; i++) {
        listPageNumber.innerHTML += `<li class="page-item"><button class="page-link" onclick="updateCurrentPage(${i})">${
          i + 1
        }</button></li>`;
      }
    } else {
      listPageNumber.innerHTML += `<li class="page-item"><button class="page-link" onclick="updateCurrentPage(${0})">${1}</button></li>`;
      if (currentPage <= 2) {
        listPageNumber.innerHTML += `<li class="page-item"><button class="page-link" onclick="updateCurrentPage(${1})">${2}</button></li>`;
        listPageNumber.innerHTML += `<li class="page-item"><button class="page-link" onclick="updateCurrentPage(${2})">${3}</button></li>`;
        listPageNumber.innerHTML += `<li class="page-item"><button class="page-link">...</button></li>`;
      } else if (currentPage >= totalPages - 2) {
        listPageNumber.innerHTML += `<li class="page-item"><button class="page-link">...</button></li>`;
        listPageNumber.innerHTML += `<li class="page-item"><button class="page-link" onclick="updateCurrentPage(${
          totalPages - 3
        })">${totalPages - 2}</button></li>`;
        listPageNumber.innerHTML += `<li class="page-item"><button class="page-link" onclick="updateCurrentPage(${
          totalPages - 2
        })">${totalPages - 1}</button></li>`;
      } else {
        listPageNumber.innerHTML += `<li class="page-item"><button class="page-link">...</button></li>`;
        listPageNumber.innerHTML += `<li class="page-item"><button class="page-link" onclick="updateCurrentPage(${currentPage})">${
          currentPage + 1
        }</button></li>`;
        listPageNumber.innerHTML += `<li class="page-item"><button class="page-link">...</button></li>`;
      }
      listPageNumber.innerHTML += `<li class="page-item"><button class="page-link" onclick="updateCurrentPage(${
        totalPages - 1
      })">${totalPages}</button></li>`;
    }
    listPageNumber.innerHTML += `<li class="page-item"><button class="page-link" onclick="nextPage()">Next</button></li>`;

    const listItems = listPageNumber.querySelectorAll(".page-item");
    listItems.forEach(function (item) {
      const itemText = item.querySelector(".page-link").innerText;
      if (
        (currentPage == 0 && itemText == "Previous") ||
        (currentPage + 1 == totalPages && itemText == "Next")
      ) {
        item.classList.add("disabled");
      }
      if (currentPage + 1 == itemText) {
        item.classList.add("active");
      }
    });
  }
}

function executeFilter() {
  currentPage = 0;
  updatePage();
}

function updatePage() {
  filterList();
  updatePagination();
  document.getElementById("listCourse").innerHTML = ``;
  if (filterArray.length > 0) {
    for (var i = 0; i < filterArray.length; i++) {
      const isInRange =
        i >= currentPage * itemsPerPage && i < (currentPage + 1) * itemsPerPage;
      if (isInRange) {
        document.getElementById("listCourse").innerHTML += `<div class="col">
						<div class="card h-100" id="course1">
							<img
								src="${filterArray[i].image}"
								class="card-img-top">
								<div class="card-header bg-white">
									<h5>${filterArray[i].courseName}</h5>
									<div class="d-flex align-items-center">
										<div class="flex-grow-1">${filterArray[i].teacherName}</div>
										<i>${filterArray[i].date}</i>
									</div>
								</div>
								<div class="card-body">
									<div class="d-flex align-items-center">
										<div class="">
											<div class="lead pe-2 text-success">
												<i class="bi bi-cash-coin"></i> ${filterArray[i].price}
											</div>
										</div>
										<div class=""><span class="badge text-bg-success"><i class="fa fa-user" aria-hidden="true"></i> ${filterArray[i].joined}</span></div>
										<div class="flex-grow-1"><p class="text-primary text-end">${filterArray[i].level}</p></div>
									</div>
									<div class="d-grid pt-2">
										<a href="#" class="btn btn-dark">Details <span
											class="badge text-bg-secondary"><i
												class="bi bi-chat-square-text-fill"></i> ${filterArray[i].reviews}</span></a>
									</div>
								</div>
								<div class="card-footer">
									<div class="d-flex align-items-center">
										<div class="pe-2 flex-grow-1">
											<a href="#" class="btn btn-outline-danger w-100"><i
												class="fa fa-heart" aria-hidden="true"></i> ${filterArray[i].wishlisted}</a>
										</div>
										<a href="#" class="btn btn-outline-primary"><i
											class="fa fa-cart-plus" aria-hidden="true"></i></a>
									</div>
								</div>
						</div>
					</div>`;
      }
    }
  } else {
    document.getElementById("listCourse").innerHTML =
      '<p class="fs-2 text-center text-danger">Not Found.</p>';
  }
}
