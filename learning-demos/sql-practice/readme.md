<h1 align="center">Structured Query Language Practice</h1>

This repository aggregates SQL programming assignments as well as notes on fundamental operations within the Microsoft SQL Server environment, covering the coursework for **Database Systems** and **Database Management Systems**.

<h2>Ngôn ngữ SQL</h2>

- `ALter Table` Chỉnh sửa bảng
- `UNION`, `INTERSECT` và `EXCEPT` cho hợp, giao và trừ
- `varchar` có thể thay đổi độ dài

<h2>Phép chiếu:</h2>

```sql
Select <Tên cột 1>, <Tên cột 2>, ...
From <Tên quan hệ>
```

Ví dụ:

```ts
//Kết quả trùng nhau
Select MaMH
From KQTHI
```

```ts
//Kết quả KHÔNG trùng nhau
Select distinct MaMH
From KQTHI
```

<h2>Phép chọn:</h2>

```sql
Select <tên cột 1>, <tên cột 2>, ...
From <tên quan hệ>
Where <biểu thức điều kiện>
```

Ví dụ: Tìm những SV thi môn học có mã 'M01' và đạt điểm trên 7

```
Select *
From KQTHI
Where MaMH = 'M01' and Diem >7
```

<h2>Like và Not like:</h2>

- `%` đại diện một nhóm ký tự bất kỳ
- `_` đại diện một ký tự bất kỳ

Ví dụ:

**Liệt kê các nhân viên họ Nguyễn:**

```sql
NV(maNV char(5), Hoten nvarchar(20), MaPB char(5), Luong real)

Select Hoten
From NV
Where Hoten like N'Nguyễn%'

//Tìm tất cả những nhóm chuỗi ký tự bắt đầu bằng 'Nguyễn' và ko quan tâm phía sau.
//'nvarchar': Kiểu chuỗi ký tự dùng bộ mã Unicode (Gõ TV) nên khi so sánh phải có chữ N trước chuỗi ký tự.
```

<h2>Các ký hiệu truy vấn khác</h2>

- **Khoảng giữa:**

  - `(NOT) BETWEEN min_value AND max_value`

- **Điều kiện:**

  - `Where`: điều kiện không liên quan đến hàm gộp
  - `Having`: điều kiện liên quan đến HÀM GỘP

- **Đổi tên:**

  - không có KHOẢNG TRẮNG và DẤU -> `as TenMoi`
  - có KHOẢNG TRẮNG và DẤU -> `as [Tên Mới]`

- **Sắp xếp:** `Order by Hoten, NgSinh Desc`

  - `Asc` (Mặc định tăng dần), `Desc` (Giảm dần)

- **So sánh:**
  - `=`: So sánh số
  - `Like`/`Not like`/`In`/`Not In`: So Sánh chuỗi

<h2>Kí hiệu thuộc tính lược đồ quan hệ </h2>

|             | Cách 1                                    | Cách 2                           |
| ----------- | ----------------------------------------- | -------------------------------- |
| **min = 0** | Đường đơn                                 | Hình tròn                        |
| **min = 1** | Đường đôi                                 | Đường gạch                       |
| **max = 1** | Mũi tên hướng vào thuộc tính đó           | Đường **KHÔNG** có dấu chân chim |
| **max = n** | Mũi tên **KHÔNG** hướng vào thuộc tính đó | Đường có dấu chân chim           |

<h2>Ánh xạ lược đồ ERD -> lược đồ quan hệ</h2>

- Tập thực thể -> `CSDL(Tên) [Kiểu thực thể -> quan hệ]`
- **Khóa chính**: Một trong các khóa ứng viên của tập thực thể
- Thuộc tính đơn -> thuộc tính của quan hệ
- Thuộc tính phức hợp -> chỉ lấy các thuộc tính thành phần

<h3>Tập thực thể yếu:</h3>

- Thực thể yếu -> quan hệ
- **Khóa chính**: Khóa chính tập thực thể mạnh + thuộc tính `NHẬN DIỆN` của tập thực thể yếu
- Các thuộc tính của tập thực thể yếu -> Thuộc tính của quan hệ

<h3>Thuộc tính đa trị:</h3>

- Mỗi thuộc tính đa trị của tập thực thể -> quan hệ
- Khóa chính: Khóa chính của tập thực thể + Thuộc tính đa trị
- Nếu thuộc tính đa trị là thuộc tính phức hợp:
  - Các thuộc tính thành phần và khóa chính của tập thực thể -> thuộc tính của quan hệ

---

<h3>Ánh xạ nhiều - nhiều:</h3>

- Mối quan hệ nhiều - nhiều -> quan hệ
- Khóa chính: Các khóa chính của các thực thể tham gia vào MQH
- Thuộc tính của MQH -> thuộc tính của quan hệ

---

<h3>Ánh xạ một - nhiều:</h3>

| Cách 1                                              | Cách 2                                                                               |
| --------------------------------------------------- | ------------------------------------------------------------------------------------ |
| Mối quan hệ một - nhiều -> quan hệ                  | Tập thực thể bên nhánh nhiều -> quan hệ                                              |
| Khóa chính: Khóa chính của thực thể bên nhánh nhiều | Khóa chính: khóa chính của tập thực thể đó                                           |
| Thuộc tính của MQH -> thuộc tính của quan hệ        | Khóa ngoại: Khóa chính của tập thực thể bên một (Tham chiếu quan hệ tương ứng)       |
|                                                     | Thuộc tính của quan hệ: Thuộc tính của tập thực thể đó + thuộc tính của MQH (nếu có) |

---

<h3>Ánh xạ một - một:</h3>

- Tập thực thể tham gia toàn bộ (Total: Ít nhất có một) -> quan hệ
- Khóa chính: khóa chính của tập thực thể đó
- Khóa ngoại: Khóa chính của tập thực thể bên nhánh tham gia một phần (Partial) tham chiếu quan hệ tương ứng
- Thuộc tính của quan hệ: Thuộc tính của tập thực thể đó + thuộc tính của mối quan hệ (nếu có)

<h3>Mối quan hệ đa phân:</h3>

- Mối quan hệ -> quan hệ
- Khóa chính: Khóa chính của các thực thể tham gia
- Thuộc tính của mối quan hệ -> thuộc tính quan hệ

---

<h3>Ánh xạ lớp cha/lớp con:</h3>

**Cách 1:**

- Thực thể cha -> quan hệ bình thường (thuộc tính, khóa chính...)
- Thực thể con:
  - Khóa chính: Khóa chính của cha
  - Thuộc tính tương ứng -> thuộc tính quan hệ

`Nhược`: Truy cập nhiều bảng để lấy thông tin ở mức thấp

**Cách 2:**

- Thực thể con:
  - Khóa chính: khóa chính của cha
  - Thuộc tính của cha + thuộc tính của con tương ứng -> thuộc tính quan hệ

`Nhược`: Dư thừa dữ liệu nếu một thực thể ở cha thuộc về nhiều hơn 1 lớp con

**Cách 3:**

- Thực thể cha -> quan hệ
- Thuộc tính quan hệ: Thuộc tính của cha tương ứng + các thuộc tính của con VÀ thêm một thuộc tính phân biệt từng bộ giá trị thuộc lớp con nào.

`Nhược`: Chỉ dùng cho disjoin và sẽ có nhiều NULL nếu các lớp con có nhiều thuộc tính

---

|                               | TRANSACTIONS                                                                                                                                                                                       |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **1. Atomic (Nguyên tử)**     | Toàn bộ các lệnh trong Transaction được thực hiện hoặc không lệnh nào được thực hiện cả.                                                                                                           |
| **2. Consistent (Nhất quán)** | Các ràng buộc của CSDL sẽ được duy trì, đảm bảo tính chất này của Transaction là trách nhiệm của người dùng.                                                                                       |
| **3. Isolated (Cô lập)**      | Một transaction khi được người dùng thực hiện thì nó thực hiện như là một tiến trình đó được thao tác tại một thời điểm. Tuy nhiên, thực tế có nhiều transaction cùng thực hiện tại một thời điểm. |
| **4. Durable (Bền vững)**     | Một transaction thực hiện thành công, nó phải được bảo đảm kể cả khi hệ thống gặp sự cố trước khi tất cả các sự thay đổi được ghi lên đĩa.                                                         |
