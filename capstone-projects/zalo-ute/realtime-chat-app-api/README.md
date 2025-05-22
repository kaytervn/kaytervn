## Zalo UTE API Application - Group 07

Software Technologies & Advance Mobile Programming Courseworks

**Members:**

| Student ID | Full Name             |                     GitHub                      |
| :--------: | --------------------- | :---------------------------------------------: |
|  21110332  | Kiến Đức Trọng        |     [kaytervn](https://github.com/kaytervn)     |
|  21110335  | Nguyễn Trần Văn Trung | [vantrung1109](https://github.com/vantrung1109) |
|  21110157  | Lê Trọng Dũng         | [trongdung721](https://github.com/trongdung721) |
|  21110294  | Võ Hữu Tài            |   [vohuutai23](https://github.com/vohuutai23)   |

**References:**

| **Resource**      | **Link**                                                                                                                                                                                                                                                                                            |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| API Documentation | [Swagger UI](https://realtime-chat-app-api-1.onrender.com/api-docs/)                                                                                                                                                                                                                                |
| Database Diagram  | [DBDiagram.IO](https://dbdiagram.io/d/ZaloUTE-66c6a9b4a346f9518cbd7113)                                                                                                                                                                                                                             |
| Figma Design      | [Figma](https://www.figma.com/design/Zd2iaoJXvTNSHX8B4IgB8M/Zalo-UTE-Web?node-id=1-2&node-type=canvas&t=Uus2gIX75ZeJz9KY-0)                                                                                                                                                                         |
| UML Diagram       | [Draw.IO Viewer](https://viewer.diagrams.net/index.html?tags=%7B%7D&lightbox=1&highlight=0000ff&edit=_blank&layers=1&nav=1&title=ZALO_UTE.drawio#Uhttps%3A%2F%2Fdrive.google.com%2Fuc%3Fid%3D10gYy3U7rP2TbTBpTU1muv2NwPHpvSXMV%26export%3Ddownload#%7B%22pageId%22%3A%221ek5O3LtdH5z4QkGbGpv%22%7D) |

**GitHub Repositories:**

| Project         | Repository Link                                                                    |                       Deployed Link                        |
| --------------- | ---------------------------------------------------------------------------------- | :--------------------------------------------------------: |
| Web - CMS       | [Github Repository](https://github.com/The-Cookies-Team/Realtime-Chat-App-CMS-Web) |  [LINK](https://realtime-chat-app-cms-web.onrender.com/)   |
| Web - Portal    | [Github Repository](https://github.com/kaytervn/Realtime-Chat-App-Portal-Web)      | [LINK](https://realtime-chat-app-portal-web.onrender.com/) |
| Mobile - CMS    | [Github Repository](https://github.com/The-Cookies-Team/Realtime-Chat-App-Flutter) |                            N/A                             |
| Mobile - Portal | [Github Repository](https://github.com/kaytervn/React-Native-App-Demo)             |                            N/A                             |

---

## Installation

To install the dependencies for the project, run the following command:

```sh
npm install
```

## Usage

### Setting environment variables

1. Edit `.env.example`:

- `PORT` - Port your server should run on (e.g. `3000`)
- `MONGODB_URI` - Your MongoDB Connection URI
- `DB_NAME` - Your MongoDB Database Name
- `JWT_SECRET` - Secret key for JWT
- `SERVER_SECRET` - A 16-bit secret key for the server (e.g. `d643hjftsdh39fje`)
- `CLOUD_NAME` - Your Cloudinary Cloud Name
- `CLOUD_API_KEY` - Your Cloudinary API Key
- `CLOUD_API_SECRET` - Your Cloudinary API Secret
- `NODEMAILER_USER` - Your Nodemailer Email
- `NODEMAILER_PASS` - Your Nodemailer Password

2. Rename `.env.example` into `.env`

### Starting the server

```sh
npm start
```

Your application will be accessible from `localhost:<YOUR_API_PORT>`

If the database is successfully initialized, a message will be displayed in the console:

```sh
Database initialized successfully.
```

You can log in using the default admin credentials via the following API endpoint:

- POST: `localhost:<YOUR_API_PORT>/v1/user/login`

**Default Credentials:**

- **Username:** `superadmin@gmail.com`
- **Password:** `123456`

To modify default data configurations, navigate to the following folder: `src`/`data`/`**`

---

# Use Case Specifications

## 1. Đăng nhập

| Field             | Value                                                    |
| ----------------- | -------------------------------------------------------- |
| Use Case ID       | UC-01                                                    |
| Use Case Name     | Đăng nhập                                                |
| Actor(s)          | Quản trị viên, người dùng                                |
| Short Description | Actor điền thông tin đăng nhập và đăng nhập vào hệ thống |
| Pre-Conditions    | Tài khoản đã được đăng ký và xác thực                    |
| Post-Conditions   | Actor đăng nhập thành công vào hệ thống                  |

### Main Flow

1. Người dùng truy cập vào App
2. Hệ thống hiển thị màn hình Đăng nhập
3. Người dùng điền thông tin đăng nhập (email, mật khẩu)
4. Nhấn "Đăng nhập"
5. Hệ thống chuyển đến giao diện trang chủ với giao diện tương ứng với role cụ thể của từng Actor

### Alternative Flow(s)

- 2.1.a. Actor bấm "Quên mật khẩu" để Reset lại mật khẩu khi cần
- 2.1.b. Hệ thống chuyển đến trang Quên mật khẩu (UC-03)
- 2.2.a. Actor bấm "Đăng ký" để đăng ký tài khoản mới
- 2.2.b. Hệ thống chuyển đến trang Đăng ký (UC-02)

### Exception Flow(s)

- 4.a. Người dùng điền thông tin không hợp lệ:
  - Thiếu trường thông tin
  - Email không chính xác
  - Mật khẩu không chính xác
- 4.b. Hệ thống sẽ hiện thông báo lỗi và yêu cầu người dùng nhập lại:
  - "Vui lòng điền đầy đủ thông tin!" nếu thiếu trường thông tin
  - "Email đăng nhập không tồn tại!" nếu email không đúng
  - "Mật khẩu không đúng!" nếu mật khẩu không chính xác
- 4.c. Quay lại màn hình ở bước 1

## 2. Đăng ký

| Field             | Value                                                               |
| ----------------- | ------------------------------------------------------------------- |
| Use Case ID       | UC-02                                                               |
| Use Case Name     | Đăng ký tài khoản người dùng                                        |
| Actor(s)          | Người dùng                                                          |
| Short Description | Hệ thống cho phép Actor đăng ký tài khoản với vai trò là người dùng |
| Pre-Conditions    | Phải ở màn hình Đăng nhập và bước 2.2b (UC-02) được thực hiện       |
| Post-Conditions   | Actor đăng ký tài khoản thành công                                  |

### Main Flow

1. Trang Đăng ký tài khoản được hệ thống hiển thị
2. Tại trang Đăng ký, Actor điền những thông tin cần thiết (email, tên, số điện thoại, mật khẩu)
3. Actor bấm nút "Đăng ký" để đăng ký tài khoản sau khi đã điền xong
4. Hệ thống gửi mã OTP xác nhận đến email
5. Chuyển đến trang xác thực tài khoản
6. Actor điền mã OTP lấy từ email
7. Actor bấm "Xác thực"
8. Chuyển hướng đến trang chủ

### Alternative Flow(s)

- 1a. Actor chọn "Đăng nhập" để đăng nhập nếu đã có tài khoản
- 1b. Chuyển hướng đến trang đăng nhập

### Exception Flow(s)

- 3a. Người dùng điền thông tin không hợp lệ:
  - Thiếu trường thông tin
  - Email đã tồn tại
  - Số điện thoại đã tồn tại
- 3b. Hệ thống sẽ hiện thông báo yêu cầu nhập lại:
  - "Vui lòng điền đầy đủ thông tin!" nếu thiếu trường thông tin
  - "Email đã được đăng ký!" nếu email đã tồn tại
  - "Số điện thoại đã được đăng ký!" nếu số điện thoại đã được đăng ký
- 4c. Quay lại bước 1
- 7a. Người dùng điền sai mã OTP
- 7b. Hệ thống sẽ hiện thông báo "Mã OTP không hợp lệ!" để yêu cầu Actor nhập lại
- 7c. Quay lại bước 6

## 3. Quên mật khẩu

| Field             | Value                                                                             |
| ----------------- | --------------------------------------------------------------------------------- |
| Use Case ID       | UC-03                                                                             |
| Use Case Name     | Quên mật khẩu                                                                     |
| Actor(s)          | Người dùng                                                                        |
| Short Description | Hệ thống cho phép Actor đổi mật khẩu khi cần thiết                                |
| Pre-Conditions    | Đã có tài khoản đăng ký thành công trên hệ thống. Truy cập vào màn hình Đăng nhập |
| Post-Conditions   | Actor đổi mật khẩu mới thành công                                                 |

### Main Flow

1. Trang Quên mật khẩu được hệ thống hiển thị
2. Tại trang Quên mật khẩu, Actor điền email tài khoản cần khôi phục mật khẩu
3. Actor bấm nút "Tiếp tục"
4. Hệ thống gửi mã OTP xác nhận đến email
5. Chuyển đến trang khôi phục tài khoản
6. Actor điền mã OTP lấy từ email, Mật khẩu cũ và mật khẩu mới
7. Actor bấm "Khôi phục"
8. Chuyển hướng đến màn hình Đăng nhập

### Alternative Flow(s)

N/A

### Exception Flow(s)

- 3a. Người dùng điền thông tin không hợp lệ:
  - Thiếu trường thông tin
  - Email không tồn tại
- 3b. Hệ thống sẽ hiện thông báo yêu cầu nhập lại:
  - "Vui lòng nhập email để khôi phục!" nếu thiếu trường email
  - "Email tài khoản không tồn tại!" nếu email chưa được đăng ký
- 3c. Quay lại bước 2
- 7a. Người dùng điền thông tin không hợp lệ:
  - Thiếu trường thông tin
  - Mã xác thực OTP không hợp lệ
  - Xác nhận mật khẩu không trùng khớp
- 7b. Hệ thống sẽ hiện thông báo yêu cầu nhập lại:
  - "Điền đầy đủ thông tin!" nếu thiếu trường thông tin
  - "OTP không hợp lệ!" nếu mã OTP không trùng khớp với mã OTP được gửi thông qua email
  - "Xác nhận mật khẩu không trùng khớp" nếu sai mật khẩu xác nhận với mật khẩu mới
- 7c. Quay lại bước 2

## 4. Quản lý thông tin cá nhân

| Field             | Value                                                                                |
| ----------------- | ------------------------------------------------------------------------------------ |
| Use Case ID       | UC-04                                                                                |
| Use Case Name     | Quản lý thông tin cá nhân                                                            |
| Actor(s)          | Người dùng                                                                           |
| Short Description | Người dùng thao tác các chức năng bổ sung và cập nhật thông tin cá nhân của bản thân |
| Pre-Conditions    | UC-1 (Đăng nhập) đã được thực hiện                                                   |
| Post-Conditions   | Người dùng có thể quản lý và cập nhật thông tin cá nhân của bản thân                 |

### Main Flow

1. Người dùng chọn "Tài khoản" trên thanh điều hướng
2. Hệ thống sẽ chuyển hướng người dùng đến trang thông tin cá nhân của họ

### Alternative Flow(s)

- 4.1.a. Actor bấm vào nút "Đổi mật khẩu"
- 4.1.b. Chuyển đến UC-6 (Đổi mật khẩu)

- 4.2.a. Actor bấm vào icon bút "Edit Profile"
- 4.2.b. Hệ thống chuyển người dùng đến trang chỉnh sửa
- 4.2.c. Người dùng điền thông tin cần chỉnh sửa (upload ảnh, tên, ngày sinh, email, số điện thoại, giới thiệu, địa chỉ)
  - 4.2.c.1.a. Người dùng bấm "Lưu" để xác nhận cập nhật thông tin
  - 4.2.c.1.b. Hệ thống hiển thị thông báo
  - 4.2.c.2. Người dùng bấm vào nút "Cancel" để hủy những thay đổi
- 4.2.d. Quay lại bước 4

- 4.3.a. Người dùng bấm vào nút "Đăng xuất"
- 4.3.b. Chuyển đến UC-5 (Đăng xuất)

### Exception Flow(s)

N/A

## 5. Đăng xuất

| Field             | Value                                                                                  |
| ----------------- | -------------------------------------------------------------------------------------- |
| Use Case ID       | UC-05                                                                                  |
| Use Case Name     | Đăng xuất                                                                              |
| Actor(s)          | Người dùng                                                                             |
| Short Description | Actor đăng xuất khỏi hệ thống sau khi đã đăng nhập và thực hiện các thao tác mong muốn |
| Pre-Conditions    | UC-1 (Đăng nhập) đã được thực hiện                                                     |
| Post-Conditions   | Người dùng đăng xuất tài khoản khỏi hệ thống thành công                                |

### Main Flow

1. Người dùng bấm vào nút tài khoản trên thanh menu
2. Hệ thống sổ ra danh sách các chức năng lựa chọn
3. Người dùng chọn nút "Đăng xuất"
4. Hệ thống hiện thông báo xác nhận đăng xuất
5. Người dùng bấm vào nút "Xác nhận"
6. Hệ thống chuyển đến trang chủ mặc định với giao diện đăng nhập

### Alternative Flow(s)

- 5a. Người dùng bấm vào nút "Hủy"
- 5b. Hệ thống tắt bảng thông báo xác nhận đăng xuất

### Exception Flow(s)

N/A

## 6. Đổi mật khẩu

| Field             | Value                                                      |
| ----------------- | ---------------------------------------------------------- |
| Use Case ID       | UC-06                                                      |
| Use Case Name     | Đổi mật khẩu                                               |
| Actor(s)          | Người dùng                                                 |
| Short Description | Người dùng thực hiện các thủ tục để đổi mật khẩu tài khoản |
| Pre-Conditions    | UC-4 (Quản lý thông tin cá nhân) đã được thực hiện         |
| Post-Conditions   | Actor đổi mật khẩu tài khoản thành công                    |

### Main Flow

1. Người dùng bấm nút "Đổi mật khẩu" tại trang quản lý thông tin cá nhân
2. Hệ thống chuyển đến trang đổi mật khẩu
3. Người dùng nhập thông tin (Mật khẩu cũ, mật khẩu mới, xác nhận mật khẩu mới)
4. Người dùng bấm nút "Lưu"
5. Hệ thống hiển thị thông báo đổi mật khẩu thành công
6. Hệ thống chuyển đến trang quản lý thông tin cá nhân

### Alternative Flow(s)

- 1.a. Người dùng bấm biểu tượng < "quay lại"
- 1.b. Hệ thống chuyển đến trang quản lý thông tin cá nhân

### Exception Flow(s)

- 4.a. Actor điền thông tin không hợp lệ:
  - Thiếu trường thông tin
  - Mật khẩu cũ không chính xác
  - Xác nhận mật khẩu mới không đúng
- 4.b. Hệ thống sẽ hiện thông báo lỗi và actor nhập lại:
  - "Vui lòng nhập đầy đủ thông tin" nếu thiếu trường thông tin
  - "Mật khẩu cũ không chính xác!" nếu mật khẩu cũ không đúng
  - "Mật khẩu không khớp!" nếu Xác nhận mật khẩu không chính xác

## 7. Quản lý tin nhắn

### Main Flow

1. Người dùng bấm nút "Tin nhắn" trên thanh điều hướng
2. Hệ thống hiển thị danh sách tin nhắn của người dùng
3. Người dùng thực hiện các thao tác quản lý

### Alternative Flow(s)

- 3.1.a. Người dùng nhập từ khóa vào thanh tìm kiếm để tìm kiếm bạn bè
- 3.1.b. Hệ thống hiển thị danh sách bạn bè theo từ khóa người dùng tìm kiếm
- 3.2.a. Người dùng bấm giữ vào 1 tin nhắn để xuất hiện bảng quản lý của tin nhắn:
  - 3.2.a.a. Người dùng bấm vào nút "Ghim"
  - 3.2.a.b. Hệ thống ghim tin nhắn người dùng lựa chọn lên đầu
  - 3.2.b.a. Người dùng bấm vào nút "Xóa"
  - 3.2.b.b. Hệ thống xóa tin nhắn người dùng lựa chọn
  - 3.2.c.a. Người dùng bấm vào nút "Tắt thông báo"
  - 3.2.c.b. Hệ thống tắt thông báo tin nhắn người dùng lựa chọn

### Exception Flow(s)

N/A

## 8. Nhắn tin

| Field             | Value                                      |
| ----------------- | ------------------------------------------ |
| Use Case ID       | UC-08                                      |
| Use Case Name     | Nhắn tin                                   |
| Actor(s)          | Người dùng                                 |
| Short Description | Người dùng thực hiện các thao tác nhắn tin |
| Pre-Conditions    | N/A                                        |
| Post-Conditions   | Người dùng nhắn tin cho bạn bè             |

### Main Flow

1. Người dùng chọn bạn bè muốn nhắn tin
2. Hệ thống hiển thị giao diện gửi tin nhắn
3. Người dùng thực hiện các thao tác gửi tin nhắn

### Alternative Flow(s)

- 3.1.a. Người dùng nhập nội dung tin nhắn vào ô "Gõ tin nhắn của bạn..."
- 3.1.b. Người dùng nhấn vào biểu tượng -> để gửi tin nhắn
- 3.2.a. Người dùng chọn biểu tượng icon sau đó lựa chọn icon
- 3.2.b. Người dùng nhấn vào biểu tượng -> để gửi tin nhắn biểu tượng icon

### Exception Flow(s)

N/A

## 9. Xem tin nhắn

| Field             | Value                            |
| ----------------- | -------------------------------- |
| Use Case ID       | UC-09                            |
| Use Case Name     | Xem tin nhắn                     |
| Actor(s)          | Người dùng                       |
| Short Description | Người dùng xem tin nhắn của mình |
| Pre-Conditions    | N/A                              |
| Post-Conditions   | Xem các tin nhắn của bản thân    |

### Main Flow

1. Người dùng chọn bạn bè muốn xem tin nhắn
2. Hệ thống hiển thị giao diện gửi tin nhắn
3. Người dùng xem tin nhắn của bạn bè mà người dùng đã chọn

### Alternative Flow(s)

N/A

### Exception Flow(s)

N/A

## 10. Quản lý bạn bè

| Field             | Value                                                                   |
| ----------------- | ----------------------------------------------------------------------- |
| Use Case ID       | UC-10                                                                   |
| Use Case Name     | Quản lý bạn bè                                                          |
| Actor(s)          | Người dùng                                                              |
| Short Description | Actor thực hiện một số thao tác với danh sách bạn bè                    |
| Pre-Conditions    | Đăng nhập                                                               |
| Post-Conditions   | Actor thực hiện thành công một số thao tác quản lý với danh sách bạn bè |

### Main Flow

1. Người dùng vào tab bạn bè
2. Hệ thống hiển thị danh sách bạn bè của người dùng
3. Người dùng nhấn vào icon "Người và dấu cộng" để thêm bạn bè, tìm kiếm số điện thoại bằng số điện thoại
4. Hệ thống trả về kết quả duy nhất của người tìm theo số điện thoại
5. Người dùng nhấn dấu cộng bên cạnh kết quả tìm được
6. Người bạn vừa thêm xuất hiện trong danh sách bạn bè

### Alternative Flow(s)

- 3.1. Người dùng chọn mục lời mời kết bạn

  - a. Hệ thống hiển thị danh sách lời mời kết bạn
  - b. Người dùng chấp nhận/từ chối lời mời kết bạn
  - c. Lời mời vừa chấp nhận/từ chối rời khỏi danh sách lời mời
  - e. Hệ thống hiển thị: "Bạn và… đã là bạn, hãy gửi lời chào đến nhau!"/ "Bạn đã từ chối lời mời kết bạn của …"
  - f. Kết thúc flow

- 3.2. Người dùng nhấn giữ 1 người bạn

  - a. Hệ thống hiển thị dialog thông tin chi tiết người bạn
  - b. Người dùng chặn/xóa người bạn
  - c. Người bạn rời khỏi danh sách bạn bè. Nếu chặn, người dùng vào danh sách chặn
  - d. Hệ thống hiển thị: "Bạn và… đã là bạn, hãy gửi lời chào đến nhau!"/ "Bạn đã từ chối lời mời kết bạn của …"
  - e. Kết thúc flow

- 3.3. Người dùng chọn tab nhóm

  - a. Người dùng long touch vào nhóm
  - b. Người dùng chọn rời nhóm
  - c. Người dùng không còn thấy nhóm
  - d. Kết thúc flow

- 3.4. Người dùng search bạn bè theo tên hoặc số điện thoại

  - a. Hệ thống trả về danh sách bạn trong từ khóa tìm kiếm (nếu theo tên) và trả về người bạn duy nhất (theo số điện thoại)
  - c. Kết thúc flow

- 3.5. Người dùng chọn tab nhóm

  - a. Người dùng chọn tạo nhóm mới
  - b. Người dùng chọn ít nhất 1 người bạn để có thể tạo nhóm
  - c. Người dùng tạo nhóm thành công và nhóm mới xuất hiện trong tab nhóm
  - d. Kết thúc flow

- 3.6. Người dùng chọn danh sách chặn

  - a. Người dùng chọn bỏ chặn
  - b. Người dùng có thể tìm kiếm người đã chặn qua số điện thoại người đã chặn (đã chặn thì không thể tìm thấy)
  - c. Kết thúc flow

- 3.7. Người dùng nhấn vào người bạn
  - a. Hệ thống chuyển đến đoạn chat giữa 2 người
  - c. Kết thúc flow

### Exception Flow(s)

- 2. Nếu người dùng chưa có người bạn nào, hệ thống hiển thị màn hình trống, không có dữ liệu
- 3.1.a. Hệ thống trả về danh sách trống, nếu người dùng chưa có lời mời kết bạn nào.
- 3.4. Hệ thống trả về danh sách trống, không có dữ liệu
- 4. Hệ thống trả về không tìm thấy dữ liệu

## 11. Quản lý bài đăng

| Field             | Value                                                                     |
| ----------------- | ------------------------------------------------------------------------- |
| Use Case ID       | UC-11                                                                     |
| Use Case Name     | Quản lý bài đăng                                                          |
| Actor(s)          | Người dùng                                                                |
| Short Description | Actor thực hiện một số thao tác với danh sách bài đăng                    |
| Pre-Conditions    | Đăng nhập                                                                 |
| Post-Conditions   | Actor thực hiện thành công một số thao tác quản lý với danh sách bài đăng |

### Main Flow

1. Người dùng vào tab bài đăng
2. Hệ thống hiển thị danh sách bài đăng của bạn bè người dùng
3. Người dùng nhấn vào icon "Dấu cộng" để thêm bài đăng
4. Người dùng nhập nội dung bài đăng, có thể thêm hình ảnh
5. Người dùng bấm nút "Tạo"
6. Quay trở lại tab bài đăng của người dùng và bài đăng mới tạo xuất hiện ở đầu tiên

### Alternative Flow(s)

- 3.1. Người dùng chọn tab bạn bè

  - a. Hệ thống hiển thị danh sách bài đăng của bạn bè người dùng
  - b. Kết thúc flow

- 3.2. Người dùng nhấn vào bài đăng

  - a. Hệ thống hiển thị chi tiết bài đăng bao gồm lượt thích cùng bình luận
  - b. Người dùng nhấn thích bài đăng
  - c. Hệ thống hiển thị button thích thay đổi cùng lượt thích tăng lên
  - d. Kết thúc flow

- 3.3. Người dùng bấm vào tab cá nhân

  - a. Người dùng nhấn giữ bài đăng
  - b. Người dùng chọn chỉnh sửa bài đăng
  - c. Người dùng chỉnh sửa nội dung, hình ảnh
  - d. Hệ thống thông báo chỉnh sửa thành công
  - e. Kết thúc flow

- 3.4. Người dùng search nội dung bài đăng
  - a. Hệ thống trả về những bài đăng có nội dung có sử dụng từ khóa search
  - b. Kết thúc flow

### Exception Flow(s)

- 2. Nếu người dùng chưa kết bạn, cũng chưa từng đăng bài, hệ thống hiển thị danh sách trống, không có dữ liệu
- 3.1.a. Nếu người dùng chưa có bạn bè, hiển thị danh sách trống, không có dữ liệu
- 3.4.a. Hệ thống trả về danh sách trống, không có dữ liệu

## 12. Bình luận

| Field             | Value                                             |
| ----------------- | ------------------------------------------------- |
| Use Case ID       | UC-12                                             |
| Use Case Name     | Bình luận                                         |
| Actor(s)          | Người dùng                                        |
| Short Description | Actor thực hiện bình luận vào bài đăng            |
| Pre-Conditions    | Đăng nhập                                         |
| Post-Conditions   | Actor thực hiện bình luận thành công vào bài đăng |

### Main Flow

1. Người dùng vào tab bài đăng
2. Người dùng chọn 1 bài đăng cụ thể
3. Người dùng nhấn vào button hay icon dạng "bình luận" để bình luận vào bài đăng
4. Người dùng nhập nội dung bình luận
5. Hệ thống thông báo người dùng bình luận thành công, đồng thời cập nhật hiển thị bình luận trên bài đăng hiện tại.

### Alternative Flow(s)

- 2. Người dùng chọn một bình luận của người khác (nếu có), chọn chữ "Trả lời" bên cạnh bình luận hoặc nhấn giữ vào bình luận và chọn "Trả lời bình luận"
  - a. Tiếp tục bước 4

### Exception Flow(s)

N/A

## 13. Quản lý thông báo

| Field             | Value                                                                                                                                                                         |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Use Case ID       | UC-13                                                                                                                                                                         |
| Use Case Name     | Quản lý thông báo                                                                                                                                                             |
| Actor(s)          | Người dùng                                                                                                                                                                    |
| Short Description | Người dùng quản lý các thông báo liên quan đến hoạt động tài khoản và tương tác của họ, bao gồm đọc và xóa thông báo, cũng như lọc thông báo theo trạng thái đã đọc/chưa đọc. |
| Pre-Conditions    | Người dùng phải đăng nhập và có trạng thái hoạt động.                                                                                                                         |
| Post-Conditions   | Thông báo được quản lý theo hành động của người dùng (đọc, xóa, lọc, v.v.).                                                                                                   |

### Main Flow

1. Người dùng truy cập mục Thông báo qua ứng dụng.
2. Hệ thống hiển thị danh sách thông báo với các tùy chọn lọc.
3. Người dùng lọc thông báo theo trạng thái đã đọc/chưa đọc.
4. Người dùng chọn hành động trên thông báo hoặc chọn "Đọc tất cả" hoặc "Xóa tất cả".
5. Hệ thống cập nhật trạng thái thông báo dựa trên hành động và trả về xác nhận.

### Alternative Flow(s)

- 2.1. Nếu không có thông báo nào, hệ thống hiển thị: "Không có thông báo mới."
- 3.1. Người dùng có thể đổi tùy chọn lọc và danh sách thông báo được cập nhật theo lựa chọn lọc mới.

### Exception Flow(s)

- 4.a. Nếu hành động trên thông báo thất bại:
  - Hệ thống hiển thị thông báo lỗi: "Cập nhật thông báo thất bại. Vui lòng thử lại."
- 4.b. Nếu lỗi xảy ra trong quá trình lọc, hệ thống hiển thị thông báo lỗi tương ứng.

## 14. Quản lý nhóm nhắn tin

| Field             | Value                                                            |
| ----------------- | ---------------------------------------------------------------- |
| Use Case ID       | UC-14                                                            |
| Use Case Name     | Quản lý nhóm nhắn tin                                            |
| Actor(s)          | Người dùng                                                       |
| Short Description | Người dùng tạo, chỉnh sửa hoặc xóa các cuộc trò chuyện nhóm.     |
| Pre-Conditions    | Người dùng phải đăng nhập và có quyền thích hợp để quản lý nhóm. |
| Post-Conditions   | Chi tiết nhóm được cập nhật theo hành động của người dùng.       |

### Main Flow

1. Người dùng điều hướng đến mục Quản lý nhóm trong ứng dụng.
2. Hệ thống hiển thị các nhóm hiện có mà người dùng là chủ sở hữu hoặc đã được mời tham gia nhóm.
3. Người dùng chọn hành động: tạo nhóm mới, chỉnh sửa nhóm hiện có, hoặc xóa nhóm.
4. Hệ thống trình bày giao diện phù hợp cho hành động được chọn:
   - Đối với tạo nhóm, người dùng nhập chi tiết (tên, thành viên) và gửi.
   - Đối với chỉnh sửa nhóm, người dùng cập nhật chi tiết mong muốn và gửi.
   - Đối với xóa nhóm, người dùng xác nhận xóa.
5. Hệ thống cập nhật thông tin nhóm dựa trên thông tin nhập vào của người dùng và trả về thông báo thành công.

### Alternative Flow(s)

- 2.1. Nếu người dùng chưa tạo hoặc chưa tham gia nhóm nào:
  - Hệ thống hiển thị thông báo: "Không có nhóm được hiển thị"

### Exception Flow(s)

- 4.a. Nếu hành động thất bại (do nhập liệu không hợp lệ, vấn đề mạng, v.v.):
  - Hệ thống hiển thị thông báo lỗi: "Hành động thất bại. Vui lòng kiểm tra chi tiết và thử lại."

## 15. Quản lý người dùng

| Field             | Value                                                                                                                    |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Use Case ID       | UC-15                                                                                                                    |
| Use Case Name     | Quản lý người dùng                                                                                                       |
| Actor(s)          | Quản trị viên                                                                                                            |
| Short Description | Hệ thống cho phép Actor quản lý các thông tin liên quan đến người dùng trong mức cho phép                                |
| Pre-Conditions    | Đã đăng nhập tài khoản với quyền quản trị viên                                                                           |
| Post-Conditions   | Actor thực hiện các thao tác quản lý người dùng và đảm bảo được các tài khoản người dùng được quản lý một cách hiệu quả. |

### Main Flow

1. Tại trang chủ, hệ thống hiển thị giao diện quản lý.
2. Actor chọn mục "Quản lý người dùng" từ thanh điều hướng.
3. Hệ thống hiển thị danh sách người dùng đã đăng ký như tên, số điện thoại, trạng thái tài khoản.
4. Thực hiện các thao tác quản lý tài khoản cần thiết.
5. Sau khi thực hiện xong thì nhấn nút "Đăng xuất".

### Alternative Flow(s)

- 4.1a. Click vào 1 user để xem thông tin của user đó.
- 4.1b. Hệ thống hiển thị thông tin của user được chọn.
- 4.1c. Nhấn vào icon X để thoát khỏi giao diện thông tin user.
- 4.1d. Quay lại màn hình danh sách tài khoản users.
- 4.2a. Actor chọn mục Chỉnh sửa trạng thái trên hàng của user cần chỉnh sửa.
- 4.2b. Thực hiện thao tác chỉnh sửa trạng thái (chờ duyệt / hoạt động / vô hiệu hoá).
- 4.3a. Actor nhập thông tin tìm kiếm tài khoản user trên thanh tìm kiếm.
- 4.3b. Nhấn Enter.
- 4.3c. Hệ thống hiển thị thông tin tài khoản cần tìm.
- 4.4a. Actor chọn mục Bộ lọc (ngày tạo mới nhất / cũ nhất / chờ duyệt / hoạt động / vô hiệu hoá).
- 4.4b. Hệ thống hiển thị danh sách tài khoản theo bộ lọc.

### Exception Flow(s)

- 4.3c Nếu không có tài khoản thoả mãn từ khóa tìm kiếm thì hiển thị "Kết quả tìm kiếm không có".

## 16. Quản lý bài viết người dùng

| Field             | Value                                                                                                   |
| ----------------- | ------------------------------------------------------------------------------------------------------- |
| Use Case ID       | UC-16                                                                                                   |
| Use Case Name     | Quản lý bài viết người dùng                                                                             |
| Actor(s)          | Quản trị viên                                                                                           |
| Short Description | Hệ thống cho phép Actor quản lý các thông tin liên quan đến bài viết của người dùng trong mức cho phép. |
| Pre-Conditions    | Đã đăng nhập tài khoản với quyền quản trị viên                                                          |
| Post-Conditions   | Actor thực hiện các thao tác quản lý bài viết của người dùng.                                           |

### Main Flow

1. Tại trang chủ, hệ thống hiển thị giao diện quản lý.
2. Actor chọn mục “Quản lý bài viết” từ thanh điều hướng.
3. Hệ thống hiển thị danh sách các bài viết của người dùng (tiêu đề, nội dung, trạng thái bài viết).
4. Thực hiện các thao tác quản lý bài viết cần thiết.
5. Sau khi thực hiện xong thì nhấn nút “Đăng xuất”.

### Alternative Flow(s)

- 4.1a. Click vào tiêu đề để xem nội dung của bài viết đó.
- 4.1b. Hệ thống hiển thị bài viết chi tiết.
- 4.1c. Nhấn vào icon X để thoát khỏi giao diện bài viết.
- 4.1d. Quay lại màn hình danh sách các bài viết của người dùng.
- 4.2a. Actor chọn mục Chỉnh sửa trạng thái trên hàng của bài viết cần chỉnh sửa.
- 4.2b. Thực hiện thao tác chỉnh sửa trạng thái (ẩn, xóa bài viết).
- 4.3a. Actor nhập thông tin tìm kiếm bài viết trên thanh tìm kiếm.
- 4.3b. Nhấn Enter.
- 4.3c. Hệ thống hiển thị thông tin bài viết có chứa từ khóa tìm kiếm (trong tiêu đề, nội dung và tên tác giả).
- 4.4a. Actor chọn mục Bộ lọc (ngày đăng mới nhất / cũ nhất).
- 4.4b. Hệ thống hiển thị danh sách các bài viết theo bộ lọc.

### Exception Flow(s)

- 4.3c. Nếu không có bài viết thoả mãn từ khóa tìm kiếm thì hiển thị “Kết quả tìm kiếm không có”.

## 17. Quản lý biểu tượng cảm xúc

| Field             | Value                                                                                    |
| ----------------- | ---------------------------------------------------------------------------------------- |
| Use Case ID       | UC-17                                                                                    |
| Use Case Name     | Quản lý biểu tượng cảm xúc                                                               |
| Actor(s)          | Quản trị viên                                                                            |
| Short Description | Quản trị viên thêm, xóa, và cập nhật các biểu tượng cảm xúc được sử dụng trong hệ thống. |
| Pre-Conditions    | Quản trị viên đã đăng nhập vào hệ thống.                                                 |
| Post-Conditions   | Biểu tượng cảm xúc trong hệ thống được cập nhật theo thao tác của quản trị viên.         |

### Main Flow

1. Quản trị viên truy cập giao diện quản lý biểu tượng cảm xúc.
2. Hệ thống hiển thị danh sách các biểu tượng cảm xúc hiện có.
3. Quản trị viên chọn thêm, sửa hoặc xóa biểu tượng cảm xúc.
4. Nếu thêm hoặc sửa, quản trị viên nhập thông tin cần thiết và tải lên hình ảnh.
5. Quản trị viên xác nhận thực hiện thay đổi.
6. Hệ thống cập nhật dữ liệu và thông báo kết quả thành công hoặc thất bại.

### Alternative Flow(s)

- 3.1. Nếu quản trị viên chọn xóa biểu tượng, hệ thống yêu cầu xác nhận trước khi xóa.
- 5.1. Quản trị viên hủy bỏ thao tác.

### Exception Flow(s)

- 6.a. Nếu cập nhật thất bại do lỗi hệ thống:
  - Hệ thống hiển thị thông báo lỗi và không thực hiện cập nhật.
