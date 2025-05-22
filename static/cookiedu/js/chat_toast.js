const toastTrigger = document.getElementById("liveToastBtn");
const toastLiveExample = document.getElementById("liveToast");

if (toastTrigger) {
  const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
  toastTrigger.addEventListener("click", () => {
    toastBootstrap.show();
  });
}

const boxChat = document.getElementById("boxChat");
boxChat.innerHTML += `<div class="d-flex pb-2">
		<div class="badge bg-secondary text-wrap text-start">
			<h6>Xin chào! Tôi có thể giúp gì cho bạn?</h6>
		</div>
		<div class="p-2 flex-grow-1"></div>
	</div>`;

const replies = {
  chào: "Xin chào! Rất vui được gặp bạn.",
  javascript:
    "JavaScript là một ngôn ngữ lập trình phổ biến được sử dụng rộng rãi trong việc phát triển ứng dụng web. Với JavaScript, bạn có thể xây dựng các trang web tương tác, ứng dụng web đa nền tảng và nhiều hơn nữa.",
  python:
    "Python là một ngôn ngữ lập trình mạnh mẽ và dễ học, thường được sử dụng trong phát triển web, khoa học dữ liệu, trí tuệ nhân tạo và nhiều lĩnh vực khác.",
  "c++":
    "C++ là một ngôn ngữ lập trình mạnh mẽ và linh hoạt, thường được sử dụng trong phát triển phần mềm, trò chơi điện tử, hệ thống nhúng và nhiều ứng dụng khác.",
  java: "Java là một ngôn ngữ lập trình phổ biến và mạnh mẽ, thường được sử dụng trong phát triển ứng dụng di động, ứng dụng máy tính, hệ thống lớn và nhiều lĩnh vực công nghệ khác.",
  react:
    "React là một thư viện JavaScript phổ biến được sử dụng để xây dựng giao diện người dùng đẹp và tương tác trong các ứng dụng web.",
  angular:
    "Angular là một framework JavaScript phổ biến được sử dụng để xây dựng các ứng dụng web động mạnh và chất lượng cao.",
  vue: "Vue.js là một framework JavaScript linh hoạt và dễ học, thường được sử dụng để xây dựng các ứng dụng web đơn trang hiệu quả.",
  git: "Git là một hệ thống quản lý phiên bản phân tán phổ biến được sử dụng để theo dõi các thay đổi trong mã nguồn trong quá trình phát triển phần mềm.",
  docker:
    "Docker là một nền tảng phần mềm để xây dựng, vận chuyển và chạy các ứng dụng trong các môi trường container.",
  kubernetes:
    "Kubernetes là một hệ thống mã nguồn mở được sử dụng để tự động hóa việc triển khai, mở rộng và quản lý các ứng dụng container trong môi trường sản xuất.",
};

document.addEventListener("DOMContentLoaded", function () {
  var button = document.getElementById("sendChatButton");

  document.addEventListener("keydown", function (event) {
    const focus =
      document.activeElement == document.getElementById("chatInput");
    if (event.key === "Enter" && focus) {
      event.preventDefault();
      button.click();
    }
  });
});

function sendMessage() {
  const chatInput = document.getElementById("chatInput").value.trim();
  if (chatInput) {
    boxChat.innerHTML += `<div class="d-flex pb-2">
				<div class="p-2 flex-grow-1"></div>
				<div class="badge bg-primary text-wrap text-start">
					<h6>${chatInput}</h6>
				</div>
				<div class="pe-2"></div>
			</div>`;
    document.getElementById("chatInput").value = "";
    const rep = false;
    Object.keys(replies).forEach((key) => {
      if (chatInput.toLowerCase().includes(key.toLowerCase())) {
        boxChat.innerHTML += `<div class="d-flex pb-2">
						<div class="badge bg-secondary text-wrap text-start">
							<h6>${replies[key]}</h6>
						</div>
						<div class="p-2 flex-grow-1"></div>
					</div>`;
        rep = true;
      }
    });
    if (!rep) {
      boxChat.innerHTML += `<div class="d-flex pb-2">
					<div class="badge bg-secondary text-wrap text-start">
						<h6>Vui lòng nhập câu hỏi của bạn!</h6>
					</div>
					<div class="p-2 flex-grow-1"></div>
				</div>`;
    }
  }
}
