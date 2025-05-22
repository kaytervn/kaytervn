<h1 align="center">C# and Windows Form Practice</h1>

This repository is utilized to archive programming assignments constructed in the C# programming language within the Visual Studio 2022 (Community Edition) development environment. These assignments pertain to coursework in **Object-Oriented Programming**, **Windows Programming**, and **Database Management Systems**.

<h2>Kết nối CSDL với Project Winform C#</h2>

**I. Tạo CSDL**

1\. Kết nối SQL với server local `(localdb)\mssqllocaldb`

![](images/Aspose.Words.f0e5952f-f0aa-4c6d-9893-6d41311d8697.001.png)

Xây dựng trước CSDL tên SQL Server với database tên `QuanLyCuaHangTienLoi`

![](images/Aspose.Words.f0e5952f-f0aa-4c6d-9893-6d41311d8697.002.png)

**II. Kết nối CSDL**

Tạo Project Winform C# trên Visual Studio 2022. Vào tab View -> Sever Explorer, Mở bảng Server Explorer.

![](images/Aspose.Words.f0e5952f-f0aa-4c6d-9893-6d41311d8697.003.png)

Trong bảng Server Explorer: Right click -> Data Connection -> Add Connection

![](images/Aspose.Words.f0e5952f-f0aa-4c6d-9893-6d41311d8697.004.png)

Bảng Add Connection hiện ra, chọn Server name là server local `(localdb)\mssqllocaldb`. Sau đó nhập tên của CSDL đã được tạo từ trước là `QuanLyCuaHangTienLoi`. Chọn OK để thêm database.

![](images/Aspose.Words.f0e5952f-f0aa-4c6d-9893-6d41311d8697.005.png)

Mở Properties của database vừa mới được thêm vào, copy Connection String.

![](images/Aspose.Words.f0e5952f-f0aa-4c6d-9893-6d41311d8697.006.png)![](images/Aspose.Words.f0e5952f-f0aa-4c6d-9893-6d41311d8697.007.png)

Right click tên Project, chọn Properties. Sau đó vào mục Setting, nhập vào các ô tương ứng: Name: `cnnStr`, Type: `string`, Scope `Application` và Value là dòng địa chỉ Connection String vừa mới copy từ database. Đóng và lưu lại.

![](images/Aspose.Words.f0e5952f-f0aa-4c6d-9893-6d41311d8697.008.png)![](images/Aspose.Words.f0e5952f-f0aa-4c6d-9893-6d41311d8697.009.png)

Cuối cùng, vào code của Form. Thêm thư viện:

`using System.Data.SqlClient;`

Và tạo đối tượng “conn” bằng dòng lệnh:

`SqlConnection conn = new SqlConnection(Properties.Settings.Default.cnnStr)`

![](images/Aspose.Words.f0e5952f-f0aa-4c6d-9893-6d41311d8697.010.png)

Để mở kết nối, dùng câu lệnh “conn.Open()” và “conn.Close()” để đóng lại khi sử dụng truy vấn trong các hàm thực thi.
