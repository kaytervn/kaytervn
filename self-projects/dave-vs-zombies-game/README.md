<h2>TÊN SẢN PHẨM</h2>
Dave VS Zombie

<h2>VẤN ĐỀ GIẢI QUYẾT</h2>
Kết hợp kiến thức của nửa cuối học phần 2 và nửa đầu học phần 3 về giao diện turtle để tạo ra ứng dụng game.

<h2>HƯỚNG DẪN</h2>

Điều khiển một nhân vật là Dave bảo vệ ngôi nhà của mình khỏi những con zombie.
- Di chuyển Dave bằng các phím mũi tên và thả ra máy cắt cỏ bằng phím “Space”.
- Người chơi vừa phải tiêu diệt zombie vừa phải nhặt các vật phẩm được rơi ra trên sân để hoàn thành màn chơi. Mỗi con zombie bị máy cắt cỏ tiêu diệt sẽ được +10 điểm.
- Chiến thắng: Nhặt đủ 10 vật phẩm và đạt số điểm là 100.
- Thất bại: Khi Dave chạm phải zombie hoặc để cho bất kỳ zombie nào tấn công vào nhà.

<h2>KIẾN THỨC</h2>

<h3>Học phần 2 và 3</h3>

Áp dụng OOP: thiết lập các phương thức và thuộc tính của đối tượng.

Sử dụng module:
- math: tính khoảng cách va chạm.
- random: đặt vị trí ngẫu nhiên, đổi trang phục ngẫu nhiên.

GUI turtle:
- Thiết lập Screen: đặt kích thước (setup), thêm ảnh (addshape), ảnh nền (bpic).
- goto, forward: di chuyển đối tượng.
- setheading: đặt hướng.
- shape: chèn ảnh cho đối tượng.
- listen, onkey: đặt lệnh cho các phím được nhấn.
- Dùng vòng lặp while để duy trì chương trình.
- Giới hạn di chuyển trong biên: kiểm tra tọa độ xcor(), ycor().
- write, clear: hiển thị và cập nhật điểm số.

Chèn âm thanh: sử dụng thư viện pygame.

<h2>TÀI NGUYÊN</h2>

Các hình ảnh nhân vật, hình nền được lấy từ tựa game Plants vs Zombies gốc.

Nhạc nền: Loonboon · Laura Shigihara - Plants Vs. Zombies (Original Video Game Soundtrack)

<h2>SÁNG TẠO</h2>

Đổi trang phục của nhân vật:
- Mỗi khi random lại vị trí.
- Theo hướng nhìn của nhân vật.

Di chuyển nhân vật theo từng nấc ô vuông.

Người chơi có thể thả máy cắt cỏ theo hướng nhìn của nhân vật.

<h2>ĐỊNH HƯỚNG MỞ RỘNG</h2>

Có giao diện menu trước khi bắt đầu chơi.

Vận dụng thao tác đọc ghi file để ghi lại số điểm cao nhất và hiển thị lên ứng dụng sau khi trò chơi kết thúc.

Thêm chướng ngại vật, khi nhân vật chạm vào sẽ trừ máu hoặc điểm số.

Thêm các nhân vật zombie di chuyển từ phía bên trái.
