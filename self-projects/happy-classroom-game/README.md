<h2>TÊN SẢN PHẨM</h2>

Happy Classroom

<h2>VẤN ĐỀ GIẢI QUYẾT</h2>

Sử dụng thư viện Pygame tạo ra các trò chơi có chủ đề xoay quanh về lớp học.  

<h2>HƯỚNG DẪN</h2>

Trò chơi có Menu lựa chọn game bao gồm 3 tựa game:

- MUSIC Classroom:
  - Mục tiêu: Người chơi gảy đàn guitar theo đúng nhịp điệu của các nốt nhạc.
  - Điều khiển nhân vật bằng phím mũi tên. Mũi tên trái/ phải để điều hướng, mũi tên lên/ xuống để gảy đàn theo từng ô mục tiêu tương ứng.
  - Khi gảy đúng nốt nhạc sẽ +10 điểm, chiến thắng khi đạt 100 điểm. Ngược lại, nếu để lỡ 3 nốt nhạc thì trò chơi sẽ kết thúc.
 
- PHYSICAL Classroom:
  - Mục tiêu: Người chơi di chuyển trên sân để thu thập những chú mèo con đi lạc.
  - Điều hướng nhân vật bằng các phím mũi tên. Khi được chạm vào, mèo con sẽ đi theo người chơi, nối đuôi thành hàng.
  - Chiến thắng: Thu nhận đủ 20 mèo con. Thất bại: Chạm vào hàng đang nối đuôi hoặc chạm vào tường đá phân cách.
 
- ENGLISH Classroom:
  - Mục tiêu: Hoàn thành lật được 6 cặp thẻ giống nhau.
  - Mỗi 2 lần lật thẻ nếu trùng sẽ biến mất, ngược lại các thẻ đó sẽ lật úp trở lại.

<h2>KIẾN THỨC</h2>

Tạo cửa sổ trò chơi bằng thư viện pygame.

Thêm âm thanh cho game sử dụng mixer.

Chèn ảnh, ảnh động theo frame, đổi trang phục, chỉnh kích thước, flip ảnh.

Di chuyển đối tượng, đặt hướng di chuyển, đặt lại vị trí, giới hạn di chuyển.

Scrolling Background: Đặt hiệu ứng âm nhạc di chuyển dưới nền.

Sử dụng key.get_pressed(): Nhấn phím, điều khiển nhân vật.

Tạo sự kiện USERVENT: Tăng tốc độ game với fps.

Kiểm tra va chạm, đặt logic so sánh tọa độ:
- Giữa 1 điểm và 1 rect: Kiểm tra nút được nhấn, thẻ được nhấn.
- Giữa 2 rect: Người chơi và mèo con.
- Target và nốt nhạc: Giới hạn tọa độ.

<h2>TÀI NGUYÊN</h2>

Nhạc: Night Shade - AdhesiveWombat: https://www.youtube.com/watch?v=mRN_T6JkH-c.

Game Characters: Giphy ThinkBIT: https://giphy.com/thinkbit/.

Hình nền/ icon: Freepik, Flaticon.

<h2>SÁNG TẠO</h2>

Cài đặt các tựa game theo concept về các lớp học.

Endless running game:
- Sprite di chuyển theo cả 2 hướng.
- Thay vì né tránh thì người chơi phải chạm để hoàn thành mục tiêu.
- Sử dụng hiệu ứng âm nhạc thay vì nền chuyển động.

Rắn săn mồi:
- Hình ảnh chuyển động, flip trái/ phải theo hướng di chuyển.
- Cạnh rìa 2 bên có thể di chuyển thông qua nhau.

<h2>ĐỊNH HƯỚNG MỞ RỘNG</h2>

Xây dựng thêm nhiều chi tiết chướng ngại vật, tăng độ khó cho game, thêm các vật phẩm tĩnh/ động giúp trò chơi đa dạng và phong phú hơn.
