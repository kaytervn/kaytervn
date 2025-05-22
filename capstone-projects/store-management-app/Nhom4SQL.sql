-- Bảng

CREATE DATABASE QuanLyCuaHangTienLoi
GO

USE QuanLyCuaHangTienLoi
GO

-- Sửa lỗi Identity nhảy số 1000
ALTER DATABASE SCOPED CONFIGURATION SET IDENTITY_CACHE = OFF
GO

/*
1. Nhân viên:   Phai		-- 0: Nam		| 1: Nữ
				TrangThai	-- 0: Nghỉ		| 1: Còn làm việc

2. Sản Phẩm:	TrangThai	-- 0: Hết bán	| 1: Còn bán


3. Kho:			LoaiKho		-- 0: Lạnh		| 1: Thường

4. Hóa Đơn		PTTT		-- 1: Tiền mặt  | 2: Chuyển Khoản	| 3: Thẻ
*/



CREATE TABLE PhuongThucThanhToan
(
	PTTT INT PRIMARY KEY,
	TenPTTT NVARCHAR(255)
)

CREATE TABLE dbo.ChucVu(
	MaCV INT IDENTITY PRIMARY KEY,
	TenCV NVARCHAR(255) NOT NULL,
	LuongTheoGio FLOAT NOT NULL
)
GO

CREATE TABLE dbo.NhanVien(
	MaNV NVARCHAR(10) PRIMARY KEY,
	TenNV NVARCHAR(255) NOT NULL,
	Sdt NVARCHAR(10) NOT NULL,
	Phai BIT NOT NULL DEFAULT 0, -- Nam 0: | Nữ :1
	NgaySinh DATE NOT NULL,
	Email NVARCHAR(255) NOT NULL ,
	MaCV INT REFERENCES dbo.ChucVu(MaCV) NOT NULL,
	TrangThai BIT NOT NULL DEFAULT 1, -- 1: Còn làm việc | 0: Nghỉ
	TenTK NVARCHAR(255) NOT NULL  UNIQUE,
	MatKhau NVARCHAR(255) NOT NULL,
	Hinh IMAGE NULL
)
GO

CREATE TABLE dbo.NhaSanXuat(
	MaNSX INT IDENTITY PRIMARY KEY,
	TenNSX NVARCHAR(255) NOT NULL,
	DiaChi NVARCHAR(255) NOT NULL
)
GO

CREATE TABLE dbo.LoaiSanPham(
	MaLoai INT IDENTITY PRIMARY KEY,
	TenLoai NVARCHAR(255) NOT NULL
)
GO

CREATE TABLE dbo.SanPham(
	MaSP INT IDENTITY PRIMARY KEY,
	TenSP NVARCHAR(255) NOT NULL,
	MaNSX INT REFERENCES dbo.NhaSanXuat(MaNSX) ON DELETE SET NULL ON UPDATE CASCADE NULL,
	MaLoai INT REFERENCES dbo.LoaiSanPham(MaLoai) ON DELETE SET NULL ON UPDATE CASCADE NULL,
	GiaBan FLOAT NOT NULL,
	GiaGoc FLOAT NOT NULL,
	TrangThai BIT NOT NULL DEFAULT 0, --1: Còn bán | 0: Hết bán
	Hinh IMAGE NULL
)
GO

CREATE TABLE dbo.Kho(
	MaSP INT REFERENCES dbo.SanPham(MaSP) ON UPDATE CASCADE NOT NULL,
	NSX DATE NOT NULL,
	HSD DATE NOT NULL,
	NgayNhapKho DATE NOT NULL,
	LoaiKho BIT NOT NULL DEFAULT 1, -- 1: Thường | 0: Lạnh
	SLTonKho INT NOT NULL,
	PRIMARY KEY (MaSP, NSX, HSD)
)
GO

CREATE TABLE dbo.CuaHang(
	MaSP INT NOT NULL,
	NSX DATE NOT NULL,
	HSD DATE NOT NULL,
	NgayXuatKho DATE NOT NULL,
	SoLuong INT NOT NULL,
	FOREIGN KEY (MaSP, NSX, HSD) REFERENCES dbo.Kho(MaSP,NSX, HSD) ON UPDATE CASCADE,
	PRIMARY KEY (MaSP, NSX, HSD)
)
GO

CREATE TABLE dbo.KhachHang(
	Sdt NVARCHAR(10) PRIMARY KEY,
	TenKH NVARCHAR(255) NOT NULL,
	DiemTichLuy FLOAT NOT NULL,
)
GO

CREATE TABLE dbo.NgayLe(
	MaNL INT IDENTITY PRIMARY KEY,
	Ngay DATE NOT NULL,
	SuKien NVARCHAR(255) NOT NULL
)
GO

CREATE TABLE dbo.HoaDon(
	MaHD INT IDENTITY PRIMARY KEY,
	MaNV NVARCHAR(10) REFERENCES dbo.NhanVien(MaNV) ON UPDATE CASCADE NULL,
	SdtKH NVARCHAR(10) REFERENCES dbo.KhachHang(Sdt) ON UPDATE CASCADE NULL,
	PTTT INT NULL, -- 1: Tiền mặt | 2: Chuyển Khoản | 3: Thẻ
	Ngay DATE NOT NULL,
	TongTienTT FLOAT NOT NULL DEFAULT 0,
	TongTienLoi FLOAT NOT NULL DEFAULT 0
)
GO

CREATE TABLE dbo.ChiTietHoaDon(
	MaHD INT REFERENCES dbo. HoaDon(MaHD) ON UPDATE CASCADE NOT NULL,
	MaSP INT NOT NULL,
	NSX DATE NOT NULL,
	HSD DATE NOT NULL,
	SoLuong INT NOT NULL,
	GiaBan FLOAT NOT NULL,
	GiaGoc FLOAT NOT NULL,
	ThanhTien FLOAT NOT NULL,
	TienLoi FLOAT NOT NULL,
	FOREIGN KEY (MaSP, NSX, HSD) REFERENCES dbo.CuaHang(MaSP, NSX, HSD)ON UPDATE CASCADE,
	PRIMARY KEY (MaHD, MaSP, NSX, HSD)
)
GO

CREATE TABLE dbo.Ca(
	MaCa NVARCHAR(10) PRIMARY KEY,
	LoaiCa INT NOT NULL,
	GioBatDau TIME NOT NULL,
	GioKetThuc TIME NOT NULL
)
GO

CREATE TABLE dbo.PhanCong(
	MaPC INT IDENTITY PRIMARY KEY,
	MaNV NVARCHAR(10) REFERENCES dbo.NhanVien(MaNV) ON UPDATE CASCADE NOT NULL,
	MaCa NVARCHAR(10) REFERENCES dbo.Ca(MaCa) ON DELETE CASCADE ON UPDATE CASCADE NOT NULL,
	NgayDangKy DATE NOT NULL,
)
GO

CREATE TABLE dbo.ChamCong(
	MaPC INT REFERENCES dbo.PhanCong(MaPC) PRIMARY KEY,
	GioBD TIME Null,
	GioKT TIME NULL,
	Luong FLOAT NULL,
)
GO

CREATE TABLE dbo.TinhLuong(
	MaNV NVARCHAR(10) REFERENCES dbo.NhanVien(MaNV) NOT NULL,
	Ngay DATE NOT NULL,
	TongLuong FLOAT NOT NULL,
	PRIMARY KEY (MaNV, Ngay)
)
GO

-- USER phân quyền

CREATE ROLE RoleNhanVien
GO

----------------------------------------------------------------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------------------------------------------------------------

--NHÂN VIÊN
Go
CREATE FUNCTION DatMaNV()
RETURNS NVARCHAR(10)
AS 
BEGIN
	DECLARE @manv NVARCHAR(10)
	DECLARE @so NVARCHAR(10)

	IF NOT EXISTS (SELECT * FROM dbo.NhanVien)
	BEGIN
		SET @so = '0';
    END
	ELSE
	BEGIN
		SELECT @so = MAX(MaNV) FROM dbo.NhanVien;
		SET @so = RIGHT(@so, 5);
		SET @So = CAST ((CAST(@so AS INT) +1) AS NVARCHAR(10))
	END
	SET @manv = 'NV' + RIGHT('00000' + @so, 5)
	RETURN @manv;
END
GO

CREATE PROCEDURE sp_ThemNhanVien
	@tennv NVARCHAR(255),
	@sdt NVARCHAR(10),
	@phai BIT,
	@ngaysinh DATE,
	@email NVARCHAR(255),
	@macv INT,
	@trangthai BIT,
	@tentk NVARCHAR(255),
	@matkhau NVARCHAR(255)
AS
BEGIN
	IF EXISTS (SELECT * FROM dbo.NhanVien WHERE TenTK = @tentk)
		RAISERROR(N'LỖI TRÙNG TÊN TÀI KHOẢN', 16, 1)
	ELSE
	BEGIN
		DECLARE @newmanv NVARCHAR(10)
		SET @newmanv = dbo.DatMaNV()
		INSERT INTO dbo.NhanVien
		(MaNV, TenNV,Sdt,Phai,NgaySinh,Email,MaCV,TrangThai,TenTK,MatKhau)
		VALUES
		(@newmanv, @tennv, @sdt,@phai,@ngaysinh,@email,@macv,@trangthai,@tentk,@matkhau)
		
		IF EXISTS (SELECT name FROM sys.sql_logins WHERE name = @tentk)
		BEGIN
			DECLARE @sqltemp55 nvarchar(2000)
			SET @sqltemp55= 'DROP LOGIN ' + @tentk
			EXEC (@sqltemp55)
		END

		DECLARE @sqlString34 nvarchar(2000)
		SET @sqlString34= 'CREATE LOGIN [' + @tentk +'] WITH PASSWORD ='''+ @matkhau +''',
		DEFAULT_DATABASE=[QuanLyCuaHangTienLoi], CHECK_EXPIRATION=OFF, CHECK_POLICY=OFF'
		EXEC (@sqlString34)

		--Tạo tài khoản người dùng đối với nhân viên đó trên database (tên người dùng trùng với tên login)
		DECLARE @sqltemp3 nvarchar(2000)
		SET @sqltemp3= 'CREATE USER ' + @tentk +' FOR LOGIN '+ @tentk
		EXEC (@sqltemp3)

		IF @macv <> 1
			BEGIN
				DECLARE @sqltemp1 nvarchar(2000)
				SET @sqltemp1= 'ALTER ROLE RoleNhanVien ADD MEMBER ' + @tentk
				EXEC (@sqltemp1)
			--ALTER ROLE RoleNhanVien ADD MEMBER @tentk
			END
		ELSE
			BEGIN
				DECLARE @sqltemp2 nvarchar(2000)
				SET @sqltemp2= 'ALTER SERVER ROLE sysadmin ADD MEMBER ' + @tentk
				EXEC (@sqltemp2)
				--ALTER ROLE RoleQuanLy ADD MEMBER @tentk
			END
	END
END
GO

CREATE PROCEDURE sp_SuaNhanVien
	@manv NVARCHAR(10),
	@tennv NVARCHAR(255),
	@sdt NVARCHAR(10),
	@phai BIT,
	@ngaysinh DATE,
	@email NVARCHAR(255),
	@macv INT,
	@trangthai BIT,
	@tentk NVARCHAR(255),
	@matkhau NVARCHAR(255)
AS
BEGIN
	DECLARE @tentkcu NVARCHAR(255)
	SELECT @tentkcu = TenTK FROM dbo.NhanVien WHERE MaNV = @manv

	DECLARE @sqltemp99 nvarchar(2000)
	SET @sqltemp99= 'Drop user ' + @tentkcu;
	EXEC (@sqltemp99)
	DECLARE @sqltemp100 nvarchar(2000)
	SET @sqltemp100= 'Drop login ' + @tentkcu;
	EXEC (@sqltemp100)

	IF EXISTS (SELECT * FROM dbo.NhanVien WHERE TenTK = @tentk AND TenTK <> @tentkcu)
		RAISERROR(N'LỖI TRÙNG TÊN TÀI KHOẢN', 16, 1)
	ELSE
	BEGIN
		UPDATE dbo.NhanVien SET TenNV = @tennv,
				Sdt = @sdt,
				Phai = @phai,
				NgaySinh = @ngaysinh,
				Email = @email,
				MaCV = @macv,
				TenTK = @tentk,
				MatKhau = @matkhau,
				TrangThai = @trangthai
		WHERE MaNV = @manv
		
		IF EXISTS (SELECT name FROM sys.sql_logins WHERE name = @tentk)
		BEGIN
			DECLARE @sqltemp55 nvarchar(2000)
			SET @sqltemp55= 'DROP LOGIN ' + @tentk
			EXEC (@sqltemp55)
		END

		DECLARE @sqlString34 nvarchar(2000)
		SET @sqlString34= 'CREATE LOGIN [' + @tentk +'] WITH PASSWORD ='''+ @matkhau +''',
		DEFAULT_DATABASE=[QuanLyCuaHangTienLoi], CHECK_EXPIRATION=OFF, CHECK_POLICY=OFF'
		EXEC (@sqlString34)

		--Tạo tài khoản người dùng đối với nhân viên đó trên database (tên người dùng trùng với tên login)
		DECLARE @sqltemp3 nvarchar(2000)
		SET @sqltemp3= 'CREATE USER ' + @tentk +' FOR LOGIN '+ @tentk
		EXEC (@sqltemp3)

		IF @macv <> 1
			BEGIN
				DECLARE @sqltemp1 nvarchar(2000)
				SET @sqltemp1= 'ALTER ROLE RoleNhanVien ADD MEMBER ' + @tentk
				EXEC (@sqltemp1)
			--ALTER ROLE RoleNhanVien ADD MEMBER @tentk
			END
		ELSE
			BEGIN
				DECLARE @sqltemp2 nvarchar(2000)
				SET @sqltemp2= 'ALTER SERVER ROLE sysadmin ADD MEMBER ' + @tentk
				EXEC (@sqltemp2)
				--ALTER ROLE RoleQuanLy ADD MEMBER @tentk
			END
	END
END
GO

CREATE PROCEDURE sp_XoaNhanVien 
	@manv NVARCHAR(10)
AS
BEGIN
	IF EXISTS (SELECT * FROM dbo.PhanCong WHERE MaNV = @maNV)
		BEGIN
			UPDATE NhanVien SET TrangThai = 0 WHERE MaNV = @maNV;
		END
	ELSE
		BEGIN
			DECLARE @tentk NVARCHAR(255)
			SELECT @tentk = TenTK FROM dbo.NhanVien WHERE MaNV = @manv

			DECLARE @sqltemp99 nvarchar(2000)
			SET @sqltemp99= 'Drop user ' + @tentk;
			EXEC (@sqltemp99)
			DECLARE @sqltemp100 nvarchar(2000)
			SET @sqltemp100= 'Drop login ' + @tentk;
			EXEC (@sqltemp100)

			DELETE FROM dbo.NhanVien WHERE MaNV = @manv
		END
END
GO

-- PHÂN CÔNG
CREATE PROCEDURE sp_ThemPhanCong
	@manv NVARCHAR(10),
	@maca NVARCHAR(10),
	@ngaydangky DATE
AS
BEGIN
	INSERT INTO dbo.PhanCong
	(MaNV,MaCa,NgayDangKy)
	VALUES
	( @manv, @maca, @ngaydangky)

	DECLARE @maxmapc int
	SELECT @maxmapc = MAX(MaPC) FROM dbo.PhanCong
	INSERT INTO dbo.ChamCong
	(MaPC, GioBD,GioKT,Luong)
	VALUES(@maxmapc, NULL, NULL, NULL)
END
GO

CREATE PROCEDURE sp_XoaPhanCong
	@mapc INT
AS
BEGIN
	DELETE FROM PhanCong Where MaPC = @mapc
END
GO

-- SẢN PHẨM
CREATE PROCEDURE sp_ThemSanPham
	@tensp NVARCHAR(255),
	@mansx INT,
	@maloai INT,
	@giaban FLOAT,
	@giagoc FLOAT,
	@trangthai BIT
AS
BEGIN
	INSERT INTO dbo.SanPham
	 (TenSP,MaNSX,MaLoai,GiaBan,GiaGoc,TrangThai
	)
	VALUES
	(@tensp, @mansx, @maloai, @giaban, @giagoc, @trangthai)
END
GO

CREATE PROCEDURE sp_SuaSanPham
	@masp INT,
	@tensp NVARCHAR(255),
	@mansx INT,
	@maloai INT,
	@giaban FLOAT,
	@giagoc FLOAT,
	@trangthai BIT
AS
BEGIN
	UPDATE dbo.SanPham SET 	
				TenSP = @tensp,
				MaNSX = @mansx,
				MaLoai = @maloai,
				GiaBan = @giaban,
				GiaGoc = @giagoc,
				TrangThai = @trangthai
	WHERE MaSP = @masp
END
GO

CREATE PROCEDURE sp_XoaSanPham
	@masp INT
AS
BEGIN
	IF EXISTS (SELECT * FROM dbo.Kho WHERE MaSP = @masp)
		UPDATE dbo.SanPham SET TrangThai = 0 WHERE MaSP = @masp;
	ELSE	
		DELETE FROM dbo.SanPham WHERE MaSP = @masp
END
GO

--KHO
CREATE PROCEDURE sp_NhapKho
	@masp INT,
	@nsx DATE,
	@hsd DATE,
	@ngaynhapkho DATE,
	@loaikho BIT, 
	@sltonkho INT
AS
BEGIN
	IF EXISTS (SELECT * FROM dbo.Kho WHERE MaSP = @masp AND NSX = @nsx AND HSD = @hsd)
		UPDATE dbo.Kho SET SLTonKho += @sltonkho 
		WHERE MaSP = @masp  AND NSX = @nsx AND HSD = @hsd
	ELSE
		INSERT INTO dbo.Kho (MaSP, NSX, HSD, NgayNhapKho,LoaiKho,SLTonKho)
		VALUES (@masp, @nsx, @hsd, @ngaynhapkho, @loaikho, @sltonkho)
END
GO


CREATE PROCEDURE sp_XoaSpVaoKho
	@masp INT,
	@nsx DATE,
	@hsd DATE
AS
BEGIN
	DELETE FROM dbo.Kho WHERE MaSP = @masp AND NSX = @nsx AND HSD = @hsd
END
GO

CREATE PROCEDURE sp_SuaSpVaoKho
	@masp INT,
	@nsx DATE,
	@hsd DATE,
	@ngaynhapkho DATE,
	@loaikho BIT, 
	@sltonkho INT
AS
BEGIN
	UPDATE dbo.Kho SET	
			NgayNhapKho = @ngaynhapkho,
			LoaiKho = @loaikho, 
			SLTonKho = @sltonkho
	WHERE MaSP = @masp AND NSX = @nsx AND HSD = @hsd
END
GO


--CỬA HÀNG	
CREATE PROCEDURE sp_XuatKho
	@masp INT,
	@nsx DATE,
	@hsd DATE,
	@ngayxuatkho DATE,
	@soluong INT
AS
BEGIN
	DECLARE @sltk INT
	SELECT @sltk = SLTonKho FROM Kho WHERE MaSP = @masp AND NSX = @nsx AND HSD = @hsd
	IF (@sltk >= @soluong)
		BEGIN
			UPDATE Kho SET SLTonKho -= @soluong
			WHERE MaSP = @masp AND NSX = @nsx AND HSD = @hsd
				IF EXISTS (SELECT * FROM dbo.CuaHang WHERE MaSP = @masp AND NSX = @nsx AND HSD = @hsd)
					UPDATE dbo.CuaHang SET SoLuong += @soluong 
					WHERE MaSP = @masp  AND NSX = @nsx AND HSD = @hsd
				ELSE
					INSERT INTO dbo.CuaHang(MaSP, NSX, HSD, NgayXuatKho, SoLuong)
					VALUES (@masp, @nsx, @hsd, @ngayxuatkho, @soluong)
		END
	ELSE
		RAISERROR('Số lượng trong Kho không đủ để thêm Sản Phẩm vào Cửa Hàng', 16,1)
END
GO	

CREATE PROCEDURE sp_TraKho
	@masp INT,
	@nsx DATE,
	@hsd DATE,
	@ngayxuatkho DATE,
	@soluong INT
AS
BEGIN
	DECLARE @sltrakho INT
	SELECT @sltrakho = SoLuong FROM dbo.CuaHang WHERE MaSP = @masp AND NSX = @nsx AND HSD = @hsd
	IF (@sltrakho >= @soluong)
		BEGIN
			UPDATE dbo.CuaHang SET SoLuong -= @soluong WHERE MaSP = @masp AND NSX = @nsx AND HSD = @hsd
			UPDATE dbo.Kho SET	  SLTonKho += @soluong WHERE MaSP = @masp AND NSX = @nsx AND HSD = @hsd
		END
	ELSE
		RAISERROR('Số lượng Trả Kho lớn hơn số lượng hiện còn có trong Cửa Hàng', 16,1)
END
GO

CREATE PROCEDURE sp_ThemKhachHang
	@sdt NVARCHAR(10),
	@tenkh NVARCHAR(255),
	@diemtichluy FLOAT
AS
BEGIN
	INSERT INTO dbo.KhachHang
	(Sdt,TenKH,DiemTichLuy)
	VALUES
	(@sdt,@tenkh, @diemtichluy)
END
GO

CREATE PROCEDURE sp_SuaKhachHang
	@sdt NVARCHAR(10),
	@tenkh NVARCHAR(255),
	@diemtichluy INT
AS
BEGIN
	UPDATE dbo.KhachHang SET 
				TenKH = @tenkh,
				DiemTichLuy = @diemtichluy			   
	WHERE SDT = @sdt
END
GO

CREATE PROCEDURE sp_XoaKhachHang
	@sdt NVARCHAR(10)
AS
BEGIN
	DELETE FROM dbo.KhachHang WHERE sdt = @sdt
END
GO

-- Ngày lễ
CREATE PROC sp_ThemNgayLe
@ngay DATE, @sukien NVARCHAR(255)
AS
BEGIN
	INSERT INTO dbo.NgayLe
	(
		Ngay,
		SuKien
	)
	VALUES
	(   @ngay,
		@sukien
	)
END
GO

CREATE PROC sp_XoaNgayLe
@manl INT
AS
BEGIN
    DELETE FROM dbo.NgayLe WHERE MaNL = @manl
END
GO

CREATE PROC sp_SuaNgayLe
@manl INT, @ngay DATE, @sukien NVARCHAR(255)
AS
BEGIN
    UPDATE dbo.NgayLe SET Ngay = @ngay, SuKien = @sukien WHERE MaNL = @manl
END
GO

-- NHÀ SẢN XUẤT
CREATE PROC sp_ThemNSX
@tennsx NVARCHAR(255), @diachi NVARCHAR(255)
AS
BEGIN
	INSERT INTO dbo.NhaSanXuat
	(
	    TenNSX,
	    DiaChi
	)
	VALUES
	(   @tennsx,
	    @diachi
	)
END
GO

CREATE PROC sp_XoaNSX
@mansx INT
AS
BEGIN
    DELETE FROM dbo.NhaSanXuat WHERE MaNSX = @mansx
END
GO

CREATE PROC sp_SuaNSX
@mansx INT, @tennsx NVARCHAR(255), @diachi NVARCHAR(255)
AS
BEGIN
    UPDATE dbo.NhaSanXuat SET TenNSX = @tennsx, DiaChi= @diachi WHERE MaNSX = @mansx
END
GO

-- HÓA ĐƠN 
CREATE PROCEDURE sp_ThemHoaDon
	@manv NVARCHAR(10),
	@sdtkh NVARCHAR(10),
	@pttt INT
AS
BEGIN
	INSERT INTO dbo.HoaDon(MaNV,sdtkh,PTTT,Ngay,TongTienTT, TongTienLoi)
	VALUES (@manv,  @sdtkh,   @pttt,  GETDATE(), 0.0, 0.0)
END
GO	

CREATE PROCEDURE sp_XoaHoaDon
@mahd INT
AS
BEGIN
	DELETE FROM dbo.ChiTietHoaDon WHERE MaHD = @mahd
	DELETE FROM dbo.HoaDon WHERE MaHD = @mahd
END
GO

-- CHI TIẾT HÓA ĐƠN
CREATE PROCEDURE sp_ThemChiTietHoaDon
	@mahd INT,
	@masp INT,
	@nsx DATE,
	@hsd DATE,
	@sl INT
AS
BEGIN
	DECLARE
	@giaban FLOAT,
	@giagoc FLOAT,
	@thanhtien FLOAT,
	@tienloi FLOAT

	SET @giaban = 0
	SET @giagoc = 0
	SET @thanhtien = 0
	SET @tienloi = 0
	DECLARE @MaHDMoi INT
	SET @MaHDMoi = @mahd

	DECLARE @slch INT
	SELECT @slch = SoLuong FROM CuaHang WHERE MaSP = @masp AND NSX = @nsx AND HSD = @hsd
	IF (@slch >= @sl )
	BEGIN
		IF NOT EXISTS (SELECT * FROM dbo.HoaDon WHERE MaHD = @mahd)
		BEGIN
			EXEC dbo.sp_ThemHoaDon	@manv = NULL, -- nvarchar(10)
									@sdtkh = NULL, -- nvarchar(10)
									@pttt = NULL  -- nvarchar(255)
			SELECT @MaHDMoi = MAX(MaHD) FROM dbo.HoaDon 
		END;

		SELECT @giaban = GiaBan, @giagoc = GiaGoc FROM dbo.SanPham WHERE @masp = MaSP 
		IF EXISTS (SELECT MaHD, MaSP, NSX, HSD FROM dbo.ChiTietHoaDon WHERE MaHD = @MaHDMoi AND MaSP = @masp AND NSX = @nsx AND HSD = @hsd)
			BEGIN
				
				UPDATE dbo.ChiTietHoaDon SET SoLuong += @sl WHERE MaHD = @MaHDMoi AND MaSP = @masp AND NSX = @nsx AND HSD = @hsd
				UPDATE dbo.ChiTietHoaDon SET ThanhTien = SoLuong * GiaBan WHERE MaHD = @MaHDMoi AND MaSP = @masp AND NSX = @nsx AND HSD = @hsd
				UPDATE dbo.ChiTietHoaDon SET TienLoi = ThanhTien - (GiaGoc * SoLuong) WHERE MaHD = @MaHDMoi AND MaSP = @masp AND NSX = @nsx AND HSD = @hsd
				SELECT @thanhtien = ThanhTien, @tienloi = TienLoi  FROM dbo.ChiTietHoaDon WHERE MaHD = @MaHDMoi AND MaSP = @masp AND NSX = @nsx AND HSD = @hsd
			END;
		ELSE
			BEGIN
				SET @thanhtien = @sl * @giaban
				SET @tienloi = @thanhtien - (@giagoc * @sl)

				INSERT INTO dbo.ChiTietHoaDon (MaHD,MaSP, NSX, HSD ,SoLuong,GiaBan,GiaGoc,ThanhTien,TienLoi)
				VALUES (@MaHDMoi, @masp, @nsx, @hsd, @sl, @giaban, @giagoc, @thanhtien, @tienloi)
			END;
		UPDATE dbo.HoaDon SET TongTienTT += @thanhtien WHERE MaHD = @MaHDMoi 
		UPDATE dbo.HoaDon SET TongTienLoi += @tienloi WHERE MaHD = @MaHDMoi
	END
	ELSE
	BEGIN
		RAISERROR('Sản Phẩm không còn đủ trong Cửa Hàng để Khách Hàng mua!', 16, 1)
	END
END
GO

CREATE PROCEDURE sp_XoaChiTietHoaDon
	@mahd INT,
	@masp INT,
	@nsx DATE,
	@hsd DATE
AS
BEGIN
	DELETE FROM dbo.ChiTietHoaDon WHERE MaHD = @mahd AND MaSP = @masp AND NSX = @nsx AND HSD = @hsd
END
GO

CREATE PROCEDURE UpDateGioBD
	@mapc INT,
	@giobd TIME
AS
BEGIN
	DECLARE @giobatdauca TIME,
			@gioketthucca TIME
	SELECT @giobatdauca = GioBatDau, @gioketthucca = GioBatDau FROM dbo.PhanCong INNER JOIN Ca ON Ca.MaCa = PhanCong.MaCa 
	WHERE @mapc = MaPC
	SET @giobatdauca = DATEADD(MINUTE, -5, @giobatdauca)
	SET @gioketthucca = DATEADD(MINUTE, 5, @gioketthucca)
	IF @giobatdauca <= @giobd AND @giobd <= @gioketthucca
		UPDATE dbo.ChamCong SET GioBD = @giobd WHERE MaPC = @mapc
	ELSE 
		RAISERROR('Bạn đã nhập giờ bắt đầu không nằm trong khoảng thời gian được phân công!', 16, 1)
END
GO

CREATE PROCEDURE UpDateGioKT
	@mapc INT,
	@giokt TIME
AS
BEGIN
	DECLARE @giobatdauca TIME,
			@gioketthucca TIME
	SELECT @giobatdauca = GioKetThuc, @gioketthucca = GioKetThuc FROM dbo.PhanCong INNER JOIN Ca ON Ca.MaCa = PhanCong.MaCa 
	WHERE @mapc = MaPC
	SET @giobatdauca = DATEADD(MINUTE, -5, @giobatdauca)
	SET @gioketthucca = DATEADD(MINUTE, 5, @gioketthucca)
	IF @giobatdauca <= @giokt AND @giokt <= @gioketthucca
		UPDATE dbo.ChamCong SET GioKT = @giokt WHERE MaPC = @mapc
	ELSE 
		RAISERROR('Bạn đã nhập giờ kết thúc không nằm trong khoảng thời gian được phân công!', 16, 1)
END
GO

CREATE FUNCTION LocDoanhThu(
@ngaybatdau DATE,
@ngayketthuc DATE)
RETURNS TABLE
AS
RETURN
(
	SELECT * FROM dbo.HoaDon WHERE @ngaybatdau <= Ngay AND Ngay <= @ngayketthuc
)
GO

CREATE FUNCTION MaxHD()
RETURNS int
AS
BEGIN
	DECLARE @result int
	SELECT @result = MAX(MaHD) FROM dbo.HoaDon
	RETURN @result
END
GO

CREATE FUNCTION TinhLuongCC(@mapc INT)
RETURNS FLOAT
AS
BEGIN
	DECLARE @luongtheogio FLOAT
	SELECT @luongtheogio = LuongTheoGio FROM dbo.ChamCong, dbo.PhanCong, dbo.NhanVien, dbo.ChucVu
	WHERE ChamCong.MaPC = dbo.PhanCong.MaPC AND dbo.PhanCong.MaNV = dbo.NhanVien.MaNV AND dbo.NhanVien.MaCV = dbo.ChucVu.MaCV AND ChamCong.MaPC = @mapc

	DECLARE @maca NVARCHAR(255)
	SELECT @maca = MaCa FROM dbo.ChamCong, dbo.PhanCong, dbo.NhanVien, dbo.ChucVu
	WHERE ChamCong.MaPC = dbo.PhanCong.MaPC AND dbo.PhanCong.MaNV = dbo.NhanVien.MaNV AND dbo.NhanVien.MaCV = dbo.ChucVu.MaCV AND ChamCong.MaPC = @mapc

	DECLARE @result FLOAT

	IF @maca LIKE 'E'
	BEGIN
		SET @result = @luongtheogio * 6
		SET @result = @result * 125 / 100
    END
	ELSE
		SET @result = @luongtheogio * 4

	DECLARE @ngaychamcong DATE
	SELECT @ngaychamcong = NgayDangKy FROM dbo.ChamCong, dbo.PhanCong, dbo.NhanVien, dbo.ChucVu
	WHERE ChamCong.MaPC = dbo.PhanCong.MaPC AND dbo.PhanCong.MaNV = dbo.NhanVien.MaNV AND dbo.NhanVien.MaCV = dbo.ChucVu.MaCV AND ChamCong.MaPC = @mapc
	IF EXISTS(SELECT * FROM dbo.NgayLe WHERE @ngaychamcong = Ngay)
		SET @result = @result * 3

	RETURN @result
END
GO

CREATE PROC ThemTinhLuong
@mapc INT
AS
BEGIN
	DECLARE @luongca FLOAT
	DECLARE @manv NVARCHAR(255)
	DECLARE @ngay DATE

	SELECT @luongca = Luong, @manv = NhanVien.MaNV, @ngay = NgayDangKy FROM dbo.ChamCong, dbo.PhanCong, dbo.NhanVien, dbo.ChucVu
	WHERE ChamCong.MaPC = dbo.PhanCong.MaPC
		AND dbo.PhanCong.MaNV = dbo.NhanVien.MaNV
		AND dbo.NhanVien.MaCV = dbo.ChucVu.MaCV
		AND ChamCong.MaPC = @mapc

	IF EXISTS(SELECT * FROM dbo.TinhLuong WHERE MaNV = @manv AND Ngay = @ngay)
		UPDATE dbo.TinhLuong SET TongLuong += @luongca WHERE MaNV = @manv AND Ngay = @ngay
	ELSE
		INSERT INTO dbo.TinhLuong
		(
			MaNV,
			Ngay,
			TongLuong
		)
		VALUES
		(   @manv,       -- MaNV - nvarchar(10)
			@ngay, -- Ngay - date
			@luongca        -- TongLuong - float
		)
END
GO

CREATE PROC UpdateTinhLuong
@mapc INT
AS
BEGIN
    UPDATE dbo.ChamCong SET Luong = dbo.TinhLuongCC(@mapc) WHERE MaPC = @mapc
END
GO

CREATE FUNCTION BangChiTietHoaDonThanhToan()
RETURNS TABLE
AS
RETURN
(
	SELECT MaSP, NSX, HSD, SoLuong FROM dbo.ChiTietHoaDon WHERE MaHD = dbo.MaxHD()
)
GO

CREATE FUNCTION TinhDoanhThu()
RETURNS NVARCHAR(255)
as
BEGIN
   DECLARE @result FLOAT
   set @RESULT = 0
   SELECT @result +=TongTienTT FROM dbo.HoaDon
   RETURN FORMAT(@result, 'N')
END
GO

CREATE PROCEDURE UpdateLaiCuaHangKhiThanhToan
AS
BEGIN
	
	DECLARE @bangthanhtoan TABLE (masptt INT, nsxtt DATE, hsdtt DATE, sl int)
	INSERT INTO @bangthanhtoan (masptt, nsxtt, hsdtt, sl)
	SELECT MaSP, NSX, HSD, SoLuong
	FROM dbo.BangChiTietHoaDonThanhToan()
	SELECT * FROM @bangthanhtoan
	DECLARE @counter INT = 1
	WHILE @counter <= (SELECT COUNT(*) FROM @bangthanhtoan)
	BEGIN
		DECLARE @masptt INT, @nsxtt DATE, @hsdtt DATE, @sl INT
		SELECT TOP 1 @masptt =masptt, @nsxtt = nsxtt, @hsdtt = hsdtt, @sl = sl FROM @bangthanhtoan ORDER BY masptt, nsxtt, hsdtt
		DELETE FROM @bangthanhtoan WHERE @masptt =masptt AND @nsxtt = nsxtt AND @hsdtt = hsdtt

		-- Thực hiện các hành động khác trên bản ghi này
		UPDATE CuaHang SET SoLuong -= @sl
		WHERE MaSP = @masptt AND NSX = @nsxtt AND HSD = @hsdtt
		-- Tăng biến đếm để xử lý bản ghi tiếp theo
	END
END
GO

-----------------------------------------------------------------------------------------------------
							--TRIGGER--

CREATE TRIGGER tg_CheckNhanVien ON dbo.NhanVien
AFTER INSERT, UPDATE AS 
DECLARE @sdt NVARCHAR(10), @ngaysinh DATE, @email NVARCHAR(255), @tentk NVARCHAR(255), @matkhau NVARCHAR(255)
SELECT @sdt=n.Sdt,@ngaysinh=n.NgaySinh,@email=n.Email,@tentk=n.TenTK,@matkhau=n.MatKhau
FROM inserted n
BEGIN
	DECLARE @error INT
	SET @error = 0
	--check SO DIEN THOAI
	IF @sdt NOT LIKE '[0][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]'
	BEGIN
		RAISERROR(N'SỐ ĐIỆN THOẠI KHÔNG HỢP LỆ ', 16, 1)
		SET @error = 1
	END
	--check NGAY SINH
	IF DATEDIFF(year, @ngaysinh, GETDATE()) < 18
	BEGIN
		RAISERROR(N'NGÀY SINH DƯỚI 18 TUỔI ', 16, 1)
		SET @error = 1
	END
	--check EMAIL
	IF @email NOT LIKE '%_@__%.__%'
	BEGIN
		RAISERROR(N'EMAIL KHÔNG HỢP LỆ ', 16, 1)
		SET @error = 1
	END
	--check TEN TAI KHOAN
	IF LEN(@tentk) < 5 OR @tentk LIKE '% %'
	BEGIN
		RAISERROR(N'TÊN TÀI KHOẢN KHÔNG HỢP LỆ', 16, 1)
		SET @error = 1
	END
	--check MAT KHAU
	IF LEN(@matkhau) < 5
	BEGIN
		RAISERROR(N'MẬT KHẨU KHÔNG HỢP LỆ ', 16, 1)
		SET @error = 1
	END
	-- ROLLBACK
	IF @error = 1
	BEGIN
		RAISERROR(N'VUI LÒNG NHẬP LẠI !', 16, 1)
		ROLLBACK TRANSACTION
	END
END
GO

-- Trigger Tích điểm (doanh thu)
CREATE TRIGGER TichDiem  ON dbo.HoaDon
AFTER UPDATE 
AS
BEGIN
	DECLARE @diemtichluy FLOAT,
			@sdt nvarchar (10)
	SELECT @diemtichluy = i.TongTienTT * 2 / 100, @sdt = KhachHang.Sdt
	FROM Inserted AS i INNER JOIN dbo.KhachHang ON KhachHang.Sdt = i.SdtKH 
	UPDATE dbo.KhachHang SET DiemTichLuy = @diemtichluy  WHERE Sdt = @sdt
END
GO

-- VIEW
CREATE VIEW ViewKho 
AS
SELECT Kho.MaSP, TenSP, NSX, HSD, NgayNhapKho, LoaiKho, SLTonKho 
FROM dbo.Kho INNER JOIN dbo.SanPham ON SanPham.MaSP = Kho.MaSP
GO

CREATE VIEW ViewCuaHang 
AS
SELECT dbo.CuaHang.MaSP, TenSP, NSX, HSD, NgayXuatKho, SoLuong
FROM dbo.CuaHang INNER JOIN dbo.SanPham ON SanPham.MaSP = dbo.CuaHang.MaSP
GO

CREATE VIEW ChiTietHoaDonThanhToan
AS
SELECT MaHD, TenSP, SoLuong, ChiTietHoaDon.GiaBan, ThanhTien
FROM dbo.ChiTietHoaDon INNER JOIN dbo.SanPham ON SanPham.MaSP = ChiTietHoaDon.MaSP
WHERE MaHD = dbo.MaxHD()
GO

 CREATE VIEW XemBangPC_NhanVien
AS
SELECT MaPC, PhanCong.MaNV, TenNV, Ca.MaCa, GioBatDau, GioKetThuc, NgayDangKy
FROM dbo.NhanVien, dbo.PhanCong, dbo.Ca 
WHERE dbo.NhanVien.MaNV = dbo.PhanCong.MaNV AND dbo.PhanCong.MaCa = dbo.Ca.MaCa
GO

----------------------------------------------------------------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------------------------------------------------------------

-- HÀM TÌM KIẾM
-- Tìm kiếm nhân viên
CREATE FUNCTION f_TimKiemNhanVien(@tk NVARCHAR(255))
RETURNS TABLE
AS
RETURN
(
	SELECT * 
	FROM NhanVien 
	WHERE LOWER(MaNV) LIKE LOWER(N'%'+@tk+N'%') 									
	   OR LOWER(TenNV) LIKE LOWER(N'%'+@tk+N'%') 
	   OR LOWER(NgaySinh) LIKE LOWER(N'%'+@tk+N'%')
	   OR LOWER(Sdt) LIKE LOWER(N'%'+@tk+N'%')
	   OR LOWER(Email) LIKE LOWER(N'%'+@tk+N'%') 
	   OR LOWER(TenTK) LIKE LOWER(N'%'+@tk+N'%')
	   OR LOWER(MatKhau) LIKE LOWER(N'%'+@tk+N'%') 
)
GO

--Tìm kiếm khách hàng
CREATE FUNCTION f_TimKiemKhachHang(@tk NVARCHAR(255))
RETURNS TABLE
AS
RETURN
(
	SELECT * 
	FROM KhachHang 
	WHERE LOWER(Sdt) LIKE LOWER(N'%'+@tk+N'%') 									
	   OR LOWER(TenKH) LIKE LOWER(N'%'+@tk+N'%') 
)
GO

--Tìm kiếm kho
CREATE FUNCTION f_TimKiemKho(@tk NVARCHAR(255))
RETURNS TABLE
AS
RETURN
(
	SELECT * 
	FROM dbo.ViewKho
	WHERE LOWER(CAST(MaSP AS NVARCHAR(255))) LIKE @tk
	   OR LOWER(TenSP) LIKE LOWER(N'%'+@tk+N'%') 
	   OR LOWER(CAST(SLTonKho AS NVARCHAR(255))) LIKE @tk
)
GO

--Tìm kiếm cửa hàng
CREATE FUNCTION f_TimKiemCuaHang(@tk NVARCHAR(255))
RETURNS TABLE
AS
RETURN
(
	SELECT * 
	FROM dbo.ViewCuaHang
	WHERE LOWER(CAST(MaSP AS NVARCHAR(255))) LIKE @tk
	   OR LOWER(TenSP) LIKE LOWER(N'%'+@tk+N'%') 
	   OR LOWER(CAST(SoLuong AS NVARCHAR(255))) LIKE @tk
)
GO

--Tìm kiếm sản phẩm
CREATE FUNCTION f_TimKiemSanPham(@tk NVARCHAR(255))
RETURNS TABLE
AS
RETURN
(
	SELECT * 
	FROM SanPham
	WHERE LOWER(CAST(MaSP AS NVARCHAR(255))) LIKE @tk
	   OR LOWER(TenSP) LIKE  LOWER(N'%'+@tk+N'%') 	
	   OR LOWER(CAST(GiaBan AS NVARCHAR(255))) LIKE @tk
	   OR LOWER(CAST(GiaGoc AS NVARCHAR(255))) LIKE @tk
)
GO

--Tìm kiếm phân công 
CREATE FUNCTION f_TimKiemPhanCong(@tk NVARCHAR(255))
RETURNS TABLE
AS
RETURN
(
	SELECT * 
	FROM XemBangPC_NhanVien 
	WHERE LOWER(MaNV) LIKE LOWER(N'%'+@tk+N'%') 
	   OR LOWER(TenNV) LIKE LOWER(N'%'+@tk+N'%') 
	   OR LOWER(MaCa) LIKE LOWER(N'%'+@tk+N'%') 
	   OR LOWER(CAST(MaPC AS NVARCHAR(255))) LIKE @tk
)
GO

-- PHÂN QUYỀN

GRANT SELECT, UPDATE ON dbo.NhanVien TO RoleNhanVien
GRANT EXECUTE ON dbo.sp_SuaNhanVien TO RoleNhanVien
GRANT EXECUTE ON dbo.MaxHD TO RoleNhanVien
GRANT SELECT, UPDATE on dbo.CuaHang TO RoleNhanVien
GRANT SELECT ON dbo.NgayLe TO RoleNhanVien
GRANT SELECT ON f_TimKiemKhachHang TO RoleNhanVien
GRANT SELECT ON f_TimKiemCuaHang TO RoleNhanVien
GRANT SELECT ON ViewCuaHang TO RoleNhanVien

GRANT SELECT, UPDATE on dbo.ChucVu TO RoleNhanVien
GRANT SELECT, UPDATE, INSERT, DELETE on dbo.KhachHang TO RoleNhanVien
GRANT EXECUTE ON dbo.sp_ThemKhachHang TO RoleNhanVien
GRANT EXECUTE ON dbo.sp_SuaKhachHang TO RoleNhanVien
GRANT EXECUTE ON dbo.sp_XoaKhachHang TO RoleNhanVien

GRANT SELECT, UPDATE, INSERT, DELETE on dbo.HoaDon TO RoleNhanVien
GRANT EXECUTE ON dbo.sp_ThemHoaDon TO RoleNhanVien
GRANT EXECUTE ON dbo.sp_XoaHoaDon TO RoleNhanVien
GRANT EXECUTE ON dbo.UpdateLaiCuaHangKhiThanhToan TO RoleNhanVien

GRANT SELECT, UPDATE, INSERT, DELETE on dbo.ChiTietHoaDon TO RoleNhanVien
GRANT EXECUTE ON dbo.sp_ThemChiTietHoaDon TO RoleNhanVien
GRANT EXECUTE ON dbo.sp_XoaChiTietHoaDon TO RoleNhanVien
GRANT SELECT ON  dbo.ChiTietHoaDonThanhToan TO RoleNhanVien

GRANT SELECT, UPDATE, INSERT, DELETE on dbo.PhanCong TO RoleNhanVien
GRANT EXECUTE ON dbo.sp_ThemPhanCong TO RoleNhanVien
GRANT EXECUTE ON dbo.sp_XoaPhanCong TO RoleNhanVien

GRANT SELECT, UPDATE, INSERT, DELETE on dbo.ChamCong TO RoleNhanVien
GRANT EXECUTE ON dbo.UpDateGioBD TO RoleNhanVien
GRANT EXECUTE ON dbo.UpDateGioKT TO RoleNhanVien
GRANT EXECUTE ON dbo.UpdateTinhLuong TO RoleNhanVien
GRANT EXECUTE ON dbo.TinhLuongCC TO RoleNhanVien

GRANT SELECT, UPDATE, INSERT ON dbo.TinhLuong TO RoleNhanVien
GRANT EXECUTE ON dbo.ThemTinhLuong TO RoleNhanVien

GRANT SELECT on dbo.PhuongThucThanhToan TO RoleNhanVien
GRANT SELECT on dbo.SanPham TO RoleNhanVien
GRANT SELECT, UPDATE, INSERT, DELETE on dbo.Ca TO RoleNhanVien
GRANT SELECT, UPDATE, INSERT, DELETE on dbo.XemBangPC_NhanVien TO RoleNhanVien
GO

--DATA
INSERT INTO dbo.ChucVu(TenCV, LuongTheoGio)
VALUES 	(N'Quản lý ', 40000),
		(N'Nhân viên Part-time', 23000), 
-- ( ít nhất 15 ca / tháng),  > 15 vẫn tính lương thêm
		(N'Nhân viên Full-time', 30000),  
-- 30 ca,  < 30 ca trừ lương
		(N'Bảo vệ', 25000)
GO

INSERT INTO dbo.NgayLe (Ngay, SuKien)
VALUES 
('2023-01-01', N'Tết Dương lịch'),
('2023-02-14', N'Ngày Valentine'),
('2023-04-30', N'Ngày Giải phóng miền Nam'),
('2023-05-01', N'Ngày Quốc tế lao động'),
('2023-09-02', N'Ngày Quốc khánh'),
('2023-12-24', N'Giáng sinh'),
('2023-12-31', N'Giao thừa');
GO

-- Quản lý
EXECUTE dbo.sp_ThemNhanVien @tennv = N'Phạm Văn U',  @sdt = '0987654341',  @phai = 0,  @ngaysinh = '1988-02-01',  @email = 'pv.u@gmail.com',   @macv = 1,  @trangthai = 1,   @tentk = 'user01',   @matkhau = '12345' 
EXECUTE dbo.sp_ThemNhanVien @tennv = N'Đỗ Thị T', @sdt = '0987654340', @phai = 1, @ngaysinh = '1989-01-01', @email = 'dt.t@gmail.com', @macv = 1, @trangthai = 1, @tentk = 'user00', @matkhau = '12345';
EXECUTE dbo.sp_ThemNhanVien @tennv = N'Nguyễn Thị V', @sdt = '0987654342', @phai = 1, @ngaysinh = '1987-03-01', @email = 'nt.v@gmail.com', @macv = 1, @trangthai = 1, @tentk = 'user22', @matkhau = '12345';
EXECUTE dbo.sp_ThemNhanVien @tennv = N'Nguyễn Văn B', @sdt = '0987654322', @phai = 0, @ngaysinh = '1992-02-01', @email = 'nv.b@gmail.com', @macv = 2, @trangthai = 1, @tentk = 'user02', @matkhau = '12345';
EXECUTE dbo.sp_ThemNhanVien @tennv = N'Nguyễn Văn C', @sdt = '0987654323', @phai = 0, @ngaysinh = '1994-03-01', @email = 'nv.c@gmail.com', @macv = 2, @trangthai = 1, @tentk = 'user03', @matkhau = '12345';
EXECUTE dbo.sp_ThemNhanVien @tennv = N'Nguyễn Văn D', @sdt = '0987654324', @phai = 0, @ngaysinh = '1996-04-01', @email = 'nv.d@gmail.com', @macv = 2, @trangthai = 1, @tentk = 'user04', @matkhau = '12345';
EXECUTE dbo.sp_ThemNhanVien @tennv = N'Nguyễn Văn E', @sdt = '0987654325', @phai = 0, @ngaysinh = '1998-05-01', @email = 'nv.e@gmail.com', @macv = 2, @trangthai = 1, @tentk = 'user05', @matkhau = '12345';
EXECUTE dbo.sp_ThemNhanVien @tennv = N'Nguyễn Văn F', @sdt = '0987654326', @phai = 0, @ngaysinh = '2000-06-01', @email = 'nv.f@gmail.com', @macv = 2, @trangthai = 1, @tentk = 'user06', @matkhau = '12345';
EXECUTE dbo.sp_ThemNhanVien @tennv = N'Nguyễn Văn G', @sdt = '0987654327', @phai = 0, @ngaysinh = '2000-07-01', @email = 'nv.g@gmail.com', @macv = 2, @trangthai = 1, @tentk = 'user07', @matkhau = '12345';
EXECUTE dbo.sp_ThemNhanVien @tennv = N'Nguyễn Văn H', @sdt = '0987654328', @phai = 0, @ngaysinh = '2000-08-01', @email = 'nv.h@gmail.com', @macv = 2, @trangthai = 1, @tentk = 'user08', @matkhau = '12345';
EXECUTE dbo.sp_ThemNhanVien @tennv = N'Nguyễn Văn I', @sdt = '0987654329', @phai = 0, @ngaysinh = '2000-09-01', @email = 'nv.i@gmail.com', @macv = 2, @trangthai = 1, @tentk = 'user09', @matkhau = '12345';
EXECUTE dbo.sp_ThemNhanVien @tennv = N'Nguyễn Văn K', @sdt = '0987654330', @phai = 0, @ngaysinh = '2000-10-01', @email = 'nv.k@gmail.com', @macv = 2, @trangthai = 1, @tentk = 'user10', @matkhau = '12345';
EXECUTE dbo.sp_ThemNhanVien @tennv = N'Nguyễn Văn L', @sdt = '0987654331', @phai = 0, @ngaysinh = '2000-11-01', @email = 'nv.l@gmail.com', @macv = 2, @trangthai = 1, @tentk = 'user11', @matkhau = '12345';
EXECUTE dbo.sp_ThemNhanVien @tennv = N'Nguyễn Thị M', @sdt = '0987654332', @phai = 1, @ngaysinh = '1991-01-02', @email = 'nt.m@gmail.com', @macv = 3, @trangthai = 1, @tentk = 'user12', @matkhau = '12345';
EXECUTE dbo.sp_ThemNhanVien @tennv = N'Nguyễn Thị N', @sdt = '0987654333', @phai = 1, @ngaysinh = '1993-02-02', @email = 'nt.n@gmail.com', @macv = 3, @trangthai = 1, @tentk = 'user13', @matkhau = '12345';
EXECUTE dbo.sp_ThemNhanVien @tennv = N'Nguyễn Thị O', @sdt = '0987654334', @phai = 1, @ngaysinh = '1995-03-02', @email = 'nt.o@gmail.com', @macv = 3, @trangthai = 1, @tentk = 'user14', @matkhau = '12345';
EXECUTE dbo.sp_ThemNhanVien @tennv = N'Nguyễn Thị P', @sdt = '0987654335', @phai = 1, @ngaysinh = '1997-04-02', @email = 'nt.p@gmail.com', @macv = 3, @trangthai = 1, @tentk = 'user15', @matkhau = '12345';
EXECUTE dbo.sp_ThemNhanVien @tennv = N'Nguyễn Thị Q', @sdt = '0987654336', @phai = 1, @ngaysinh = '1999-05-02', @email = 'nt.q@gmail.com', @macv = 3, @trangthai = 1, @tentk = 'user16', @matkhau = '12345';
EXECUTE dbo.sp_ThemNhanVien @tennv = N'Trần Văn R', @sdt = '0987654337', @phai = 0, @ngaysinh = '1992-01-03', @email = 'tv.r@gmail.com', @macv = 4, @trangthai = 1, @tentk = 'user17', @matkhau = '12345';
EXECUTE dbo.sp_ThemNhanVien @tennv = N'Trần Văn S', @sdt = '0987654338', @phai = 0, @ngaysinh = '1994-02-03', @email = 'tv.s@gmail.com', @macv = 4, @trangthai = 1, @tentk = 'user18', @matkhau = '12345';
EXECUTE dbo.sp_ThemNhanVien @tennv = N'Trần Văn T', @sdt = '0987654339', @phai = 0, @ngaysinh = '1996-03-03', @email = 'tv.t@gmail.com', @macv = 4, @trangthai = 1, @tentk = 'user19', @matkhau = '12345';
EXECUTE dbo.sp_ThemNhanVien @tennv = N'Trần Văn U', @sdt = '0987654399', @phai = 0, @ngaysinh = '1998-04-03', @email = 'tv.u@gmail.com', @macv = 4, @trangthai = 1, @tentk = 'user20', @matkhau = '12345';
EXECUTE dbo.sp_ThemNhanVien @tennv = N'Trần Văn V', @sdt = '0987654388', @phai = 0, @ngaysinh = '2000-05-03', @email = 'tv.v@gmail.com', @macv = 4, @trangthai = 1, @tentk = 'user21', @matkhau = '12345';
GO

INSERT INTO dbo.Ca(MaCa, LoaiCa, GioBatDau, GioKetThuc)
VALUES 
		('A', 1, '06:00:00', '10:00:00'),
		('B', 2,  '10:00:00', '14:00:00'),
		('C', 3, '14:00:00', '18:00:00'),
		('D', 4, '18:00:00', '22:00:00'),
		('E', 5, '22:00:00', '06:00:00')
GO

EXEC dbo.sp_ThemPhanCong @manv = N'NV00000', @maca = N'A', @ngaydangky = '2022-01-01' 
EXEC dbo.sp_ThemPhanCong @manv = N'NV00002', @maca = N'A', @ngaydangky = '2022-01-01' 
EXEC dbo.sp_ThemPhanCong @manv = N'NV00017', @maca = N'A', @ngaydangky = '2022-01-01' 
EXEC dbo.sp_ThemPhanCong @manv = N'NV00000', @maca = N'B', @ngaydangky = '2022-01-01' 
EXEC dbo.sp_ThemPhanCong @manv = N'NV00003', @maca = N'B', @ngaydangky = '2022-01-01' 
EXEC dbo.sp_ThemPhanCong @manv = N'NV00018', @maca = N'B', @ngaydangky = '2022-01-01' 
EXEC dbo.sp_ThemPhanCong @manv = N'NV00022', @maca = N'C', @ngaydangky = '2022-01-01' 
EXEC dbo.sp_ThemPhanCong @manv = N'NV00004', @maca = N'C', @ngaydangky = '2022-01-01' 
EXEC dbo.sp_ThemPhanCong @manv = N'NV00019', @maca = N'C', @ngaydangky = '2022-01-01' 
EXEC dbo.sp_ThemPhanCong @manv = N'NV00022', @maca = N'D', @ngaydangky = '2022-01-01' 
EXEC dbo.sp_ThemPhanCong @manv = N'NV00005', @maca = N'D', @ngaydangky = '2022-01-01' 
EXEC dbo.sp_ThemPhanCong @manv = N'NV00020', @maca = N'D', @ngaydangky = '2022-01-01' 
EXEC dbo.sp_ThemPhanCong @manv = N'NV00001', @maca = N'E', @ngaydangky = '2022-01-01' 
EXEC dbo.sp_ThemPhanCong @manv = N'NV00006', @maca = N'E', @ngaydangky = '2022-01-01' 
EXEC dbo.sp_ThemPhanCong @manv = N'NV00021', @maca = N'E', @ngaydangky = '2022-01-01' 
EXEC dbo.sp_ThemPhanCong @manv = N'NV00000', @maca = N'A', @ngaydangky = '2022-01-01' 
EXEC dbo.sp_ThemPhanCong @manv = N'NV00007', @maca = N'A', @ngaydangky = '2022-01-01' 
EXEC dbo.sp_ThemPhanCong @manv = N'NV00021', @maca = N'A', @ngaydangky = '2022-01-01' 
EXEC dbo.sp_ThemPhanCong @manv = N'NV00000', @maca = N'B', @ngaydangky = '2022-01-01' 
EXEC dbo.sp_ThemPhanCong @manv = N'NV00008', @maca = N'B', @ngaydangky = '2022-01-01' 
EXEC dbo.sp_ThemPhanCong @manv = N'NV00020', @maca = N'B', @ngaydangky = '2022-01-01' 
EXEC dbo.sp_ThemPhanCong @manv = N'NV00022', @maca = N'C', @ngaydangky = '2022-01-01' 
EXEC dbo.sp_ThemPhanCong @manv = N'NV00009', @maca = N'C', @ngaydangky = '2022-01-01' 
EXEC dbo.sp_ThemPhanCong @manv = N'NV00019', @maca = N'C', @ngaydangky = '2022-01-01' 
EXEC dbo.sp_ThemPhanCong @manv = N'NV00022', @maca = N'D', @ngaydangky = '2022-01-01' 
EXEC dbo.sp_ThemPhanCong @manv = N'NV00010', @maca = N'D', @ngaydangky = '2022-01-01' 
EXEC dbo.sp_ThemPhanCong @manv = N'NV00018', @maca = N'D', @ngaydangky = '2022-01-01' 
EXEC dbo.sp_ThemPhanCong @manv = N'NV00001', @maca = N'E', @ngaydangky = '2022-01-01' 
EXEC dbo.sp_ThemPhanCong @manv = N'NV00011', @maca = N'E', @ngaydangky = '2022-01-01' 
EXEC dbo.sp_ThemPhanCong @manv = N'NV00017', @maca = N'E', @ngaydangky = '2022-01-01' 
EXEC dbo.sp_ThemPhanCong @manv = N'NV00000', @maca = N'A', @ngaydangky = '2022-01-01' 
EXEC dbo.sp_ThemPhanCong @manv = N'NV00012', @maca = N'A', @ngaydangky = '2022-01-01' 
EXEC dbo.sp_ThemPhanCong @manv = N'NV00017', @maca = N'A', @ngaydangky = '2022-01-01' 
EXEC dbo.sp_ThemPhanCong @manv = N'NV00000', @maca = N'B', @ngaydangky = '2022-01-01' 
EXEC dbo.sp_ThemPhanCong @manv = N'NV00012', @maca = N'B', @ngaydangky = '2022-01-01' 
EXEC dbo.sp_ThemPhanCong @manv = N'NV00018', @maca = N'B', @ngaydangky = '2022-01-01' 
EXEC dbo.sp_ThemPhanCong @manv = N'NV00022', @maca = N'C', @ngaydangky = '2022-01-01' 
EXEC dbo.sp_ThemPhanCong @manv = N'NV00013', @maca = N'C', @ngaydangky = '2022-01-01' 
EXEC dbo.sp_ThemPhanCong @manv = N'NV00019', @maca = N'C', @ngaydangky = '2022-01-01' 
EXEC dbo.sp_ThemPhanCong @manv = N'NV00022', @maca = N'D', @ngaydangky = '2022-01-01' 
EXEC dbo.sp_ThemPhanCong @manv = N'NV00013', @maca = N'D', @ngaydangky = '2022-01-01' 
EXEC dbo.sp_ThemPhanCong @manv = N'NV00020', @maca = N'D', @ngaydangky = '2022-01-01' 
EXEC dbo.sp_ThemPhanCong @manv = N'NV00001', @maca = N'E', @ngaydangky = '2022-01-01' 
EXEC dbo.sp_ThemPhanCong @manv = N'NV00014', @maca = N'E', @ngaydangky = '2022-01-01' 
EXEC dbo.sp_ThemPhanCong @manv = N'NV00021', @maca = N'E', @ngaydangky = '2022-01-01' 
EXEC dbo.sp_ThemPhanCong @manv = N'NV00000', @maca = N'A', @ngaydangky = '2022-01-01' 
EXEC dbo.sp_ThemPhanCong @manv = N'NV00015', @maca = N'A', @ngaydangky = '2022-01-01' 
EXEC dbo.sp_ThemPhanCong @manv = N'NV00021', @maca = N'A', @ngaydangky = '2022-01-01' 
EXEC dbo.sp_ThemPhanCong @manv = N'NV00000', @maca = N'B', @ngaydangky = '2022-01-01' 
EXEC dbo.sp_ThemPhanCong @manv = N'NV00015', @maca = N'B', @ngaydangky = '2022-01-01' 
EXEC dbo.sp_ThemPhanCong @manv = N'NV00020', @maca = N'B', @ngaydangky = '2022-01-01' 
EXEC dbo.sp_ThemPhanCong @manv = N'NV00022', @maca = N'C', @ngaydangky = '2022-01-01' 
EXEC dbo.sp_ThemPhanCong @manv = N'NV00016', @maca = N'C', @ngaydangky = '2022-01-01' 
EXEC dbo.sp_ThemPhanCong @manv = N'NV00019', @maca = N'C', @ngaydangky = '2022-01-01' 
EXEC dbo.sp_ThemPhanCong @manv = N'NV00022', @maca = N'D', @ngaydangky = '2022-01-01' 
EXEC dbo.sp_ThemPhanCong @manv = N'NV00016', @maca = N'D', @ngaydangky = '2022-01-01' 
EXEC dbo.sp_ThemPhanCong @manv = N'NV00018', @maca = N'D', @ngaydangky = '2022-01-01' 
EXEC dbo.sp_ThemPhanCong @manv = N'NV00001', @maca = N'E', @ngaydangky = '2022-01-01' 
EXEC dbo.sp_ThemPhanCong @manv = N'NV00014', @maca = N'E', @ngaydangky = '2022-01-01' 
EXEC dbo.sp_ThemPhanCong @manv = N'NV00017', @maca = N'E', @ngaydangky = '2022-01-01' 

INSERT INTO dbo.NhaSanXuat(TenNSX, DiaChi)
VALUES  
        (N'Coca-Cola', N'Hồ Chí Minh'),
		(N'Acecook', N'Biên Hòa'),
		(N'CJ Foods', N'Hà Nội'),
		(N'Dalat Vinfarm', N'Hồ Chí Minh'),
		(N'Thiên Long', N'Thủ Đức'),
		(N'Vinatowel Việt Nam', N'Bình Dương'),
		(N'Unilever', N'Hà Nội'),
		(N'Masan', N'Hà Nội'),
		(N'Kinh Đô', N'Bình Dương'),
		(N'Vinamilk', N'Hồ Chí Minh'),
		(N'HighLand', N'Hồ Chí Minh')
GO

INSERT INTO dbo.LoaiSanPham (TenLoai) 
VALUES 
    (N'Đồ uống'),
    (N'Đồ ăn vặt'),
    (N'Đồ ăn đông lạnh'),
    (N'Rau củ quả'),
    (N'Đồ dùng học tập'),
    (N'Đồ dùng gia dụng'),
    (N'Đồ dùng sinh hoạt'),
    (N'Đồ ăn nhanh')
GO

INSERT INTO dbo.SanPham(TenSP, MaNSX, MaLoai, GiaBan, GiaGoc, TrangThai)
VALUES
(N'Coca', 		1, 1, 10000,	8000,      1),
(N'Sprite',		1, 1, 8000,		5000, 1),
(N'Aquafina',    1,1, 5000,		3000, 1),
(N'Fanta ',		1, 1, 9000,		5000, 1),
(N'Aquarius',	1, 1, 9000,		5000, 1),
(N'Mì Hảo Hảo',	2, 8, 3500,		3000,  1),
(N'Mì SiuKay',	2, 8, 5000,		4000,  1),
(N'Mì Udon',		2, 8, 12000,	10000, 1),
(N'Mì Đệ Nhất',	2, 8 , 8000,		5000,  1),
(N'Kimchi',		3, 3 , 50000,	30000,  1),
(N'Mandu',		3, 3 , 35000,	25000,  1),
(N'Há cảo',		3, 3 , 40000,	25000,  1),
(N'Tokbokki',	3, 3 , 30000,	20000,  1),
(N'Chả giò',		3, 3 , 55000,	30000,  1),
(N'Xà lách',		4, 4 , 20000,	15000, 1),
(N'Cà chua',		4, 4 , 7000,		6000,  1),
(N'Súp lơ',		4, 4 , 35000,	30000, 1),
(N'Ớt chuông',	4, 4 , 30000,	25000, 1),
(N'Khoai tây',	4, 4 , 25000,	20000, 1),
(N'Vở',			5, 5 , 5000,		4000, 1),
(N'Bút',			5, 5, 3000,		2000, 1),
(N'Giấy note',	5, 5, 10000,	8000, 1),
(N'Dao kéo',		6, 6, 105000,	80000, 1),
(N'Bàn chải',	6, 6, 20000,	15000, 1),
(N'Khăn',		6, 6, 35000, 	30000, 1),
(N'Nước lau nhà',6, 6, 45000,	30000, 1),
(N'Bột giặt',	6, 6, 65000,	50000, 1),
(N'Dầu gội đầu',	7, 7, 150000,	100000, 1),
(N'Sữa tắm',		7, 7, 100000,	80000,  1),
(N'Tương ớt',	8, 6, 25000, 	20000, 1),
(N'Nước tương',	8, 6, 25000,	 20000, 1),
(N'Bánh Cornetto',9, 2, 18000,	 15000, 1),
(N'Bánh mì bơ sữa',9, 2, 15000, 	11000, 1),
(N'Sữa chua', 	10, 2 , 25000,	 22000, 1),
(N'Sữa tươi',	10, 1 , 7800, 	7000, 1),
(N'Cà phê đen',	11, 1 , 12000,	 10000, 1),
(N'Cafe sữa',	11, 1 , 16000, 	13000, 1),
(N'Lipton',		11, 1 , 22000, 	18000, 1),
(N'Bánh bao', 	 3, 8 , 22000,	 15000, 1),
(N'Bánh giò', 	 3, 8 , 15000,	 10000, 1),
(N'Hambuger',	 3, 8 , 25000, 	15000, 1)
GO

INSERT INTO dbo.KhachHang (Sdt, TenKH, DiemTichLuy)
VALUES
    ('0123456701','Nguyen Van A', 2000),
    ('0123456702','Tran Thi B', 3000),
	('0123456703','Le Van C', 2500),
	('0123456704','Pham Tuan D', 3500),
	('0123456705','Vo Thi E', 4000),
	('0123456706','Hoang Van F', 2200),
	('0123456707','Nguyen Thi G', 2800),
	('0123456708','Tran Van H', 3200),
	('0123456709','Le Thi I', 2700),
	('0123456710','Pham Van J', 3800),
	('0123456711','Nguyen Van K', 4200),
	('0123456712','Tran Thi L', 3500),
	('0123456713','Le Van M', 3100),
	('0123456714','Pham Tuan N', 3800),
	('0123456715','Vo Thi O', 4400),
	('0123456716','Hoang Van P', 2700),
	('0123456717','Nguyen Thi Q', 2900),
	('0123456718','Tran Van R', 4100),
	('0123456719','Le Thi S', 3300),
	('0123456720','Pham Van T', 4600),
	('0123456721','Nguyen Van U', 3900),
	('0123456722','Tran Thi V', 3400),
	('0123456723','Le Van W', 4800),
	('0123456724','Pham Tuan X', 5200),
	('0123456725','Vo Thi Y', 4500),
	('0123456726','Nguyen Van Z', 12000),
	('0123456727','Tran Thi A1', 13000),
	('0123456728','Le Van B1', 11000),
	('0123456729','Pham Tuan C1', 15000),
	('0123456730','Vo Thi D1', 14000),
	('0123456731','Hoang Van E1', 12500),
	('0123456732','Nguyen Thi F1', 11000),
	('0123456733','Tran Van G1', 11500),
	('0123456734','Le Thi H1', 13500),
	('0123456735','Pham Van I1', 12000)
GO

EXEC sp_NhapKho @masp = 01, @nsx = '2023-04-17', @hsd = '2023-06-17', @ngaynhapkho ='2023-04-20', @loaikho = 1, @sltonkho = 120; 
EXEC sp_NhapKho @masp = 02, @nsx = '2023-04-17', @hsd = '2023-06-17', @ngaynhapkho ='2023-04-20', @loaikho = 1, @sltonkho = 120; 
EXEC sp_NhapKho @masp = 03, @nsx = '2023-04-17', @hsd = '2023-06-17', @ngaynhapkho ='2023-04-20', @loaikho = 1, @sltonkho = 120; 
EXEC sp_NhapKho @masp = 04, @nsx = '2023-04-17', @hsd = '2023-06-17', @ngaynhapkho ='2023-04-20', @loaikho = 1, @sltonkho = 120; 
EXEC sp_NhapKho @masp = 05, @nsx = '2023-04-17', @hsd = '2023-06-17', @ngaynhapkho ='2023-04-20', @loaikho = 1, @sltonkho = 120; 
EXEC sp_NhapKho @masp = 06, @nsx = '2023-04-17', @hsd = '2023-06-17', @ngaynhapkho ='2023-04-20', @loaikho = 1, @sltonkho = 150; 
EXEC sp_NhapKho @masp = 07, @nsx = '2023-04-17', @hsd = '2023-06-17', @ngaynhapkho ='2023-04-20', @loaikho = 1, @sltonkho = 150; 
EXEC sp_NhapKho @masp = 08, @nsx = '2023-04-17', @hsd = '2023-06-17', @ngaynhapkho ='2023-04-20', @loaikho = 1, @sltonkho = 150; 
EXEC sp_NhapKho @masp = 09, @nsx = '2023-04-17', @hsd = '2023-06-17', @ngaynhapkho ='2023-04-20', @loaikho = 1, @sltonkho = 150; 
EXEC sp_NhapKho @masp = 10, @nsx = '2023-04-17', @hsd = '2023-06-17', @ngaynhapkho ='2023-04-20', @loaikho = 0, @sltonkho = 250; 
EXEC sp_NhapKho @masp = 11, @nsx = '2023-04-17', @hsd = '2023-06-17', @ngaynhapkho ='2023-04-20', @loaikho = 0, @sltonkho = 250; 
EXEC sp_NhapKho @masp = 12, @nsx = '2023-04-17', @hsd = '2023-06-17', @ngaynhapkho ='2023-04-20', @loaikho = 0, @sltonkho = 250; 
EXEC sp_NhapKho @masp = 13, @nsx = '2023-04-17', @hsd = '2023-06-17', @ngaynhapkho ='2023-04-20', @loaikho = 0, @sltonkho = 250; 
EXEC sp_NhapKho @masp = 14, @nsx = '2023-04-17', @hsd = '2023-06-17', @ngaynhapkho ='2023-04-20', @loaikho = 0, @sltonkho = 250;
EXEC sp_NhapKho @masp = 15, @nsx = '2023-04-17', @hsd = '2023-06-17', @ngaynhapkho ='2023-04-20', @loaikho = 1, @sltonkho = 120; 
EXEC sp_NhapKho @masp = 16, @nsx = '2023-04-17', @hsd = '2023-06-17', @ngaynhapkho ='2023-04-20', @loaikho = 1, @sltonkho = 150; 
EXEC sp_NhapKho @masp = 17, @nsx = '2023-04-17', @hsd = '2023-06-17', @ngaynhapkho ='2023-04-20', @loaikho = 1, @sltonkho = 150; 
EXEC sp_NhapKho @masp = 18, @nsx = '2023-04-17', @hsd = '2023-06-17', @ngaynhapkho ='2023-04-20', @loaikho = 1, @sltonkho = 150; 
EXEC sp_NhapKho @masp = 19, @nsx = '2023-04-17', @hsd = '2023-06-17', @ngaynhapkho ='2023-04-20', @loaikho = 1, @sltonkho = 150;
EXEC sp_NhapKho @masp = 20, @nsx = '2023-04-17', @hsd = '2023-06-17', @ngaynhapkho ='2023-04-20', @loaikho = 1, @sltonkho = 250; 
EXEC sp_NhapKho @masp = 21, @nsx = '2023-04-17', @hsd = '2023-06-17', @ngaynhapkho ='2023-04-20', @loaikho = 1, @sltonkho = 100; 
EXEC sp_NhapKho @masp = 22, @nsx = '2023-04-17', @hsd = '2023-06-17', @ngaynhapkho ='2023-04-20', @loaikho = 1, @sltonkho = 150; 
EXEC sp_NhapKho @masp = 23, @nsx = '2023-04-17', @hsd = '2023-06-17', @ngaynhapkho ='2023-04-20', @loaikho = 1, @sltonkho = 150; 
EXEC sp_NhapKho @masp = 24, @nsx = '2023-04-17', @hsd = '2023-06-17', @ngaynhapkho ='2023-04-20', @loaikho = 1, @sltonkho = 150; 
EXEC sp_NhapKho @masp = 25, @nsx = '2023-04-17', @hsd = '2023-06-17', @ngaynhapkho ='2023-04-20', @loaikho = 1, @sltonkho = 150; 
EXEC sp_NhapKho @masp = 26, @nsx = '2023-04-17', @hsd = '2023-06-17', @ngaynhapkho ='2023-04-20', @loaikho = 1, @sltonkho = 150; 
EXEC sp_NhapKho @masp = 27, @nsx = '2023-04-17', @hsd = '2023-06-17', @ngaynhapkho ='2023-04-20', @loaikho = 1, @sltonkho = 150; 
EXEC sp_NhapKho @masp = 28, @nsx = '2023-04-17', @hsd = '2023-06-17', @ngaynhapkho ='2023-04-20', @loaikho = 1, @sltonkho = 150; 
EXEC sp_NhapKho @masp = 29, @nsx = '2023-04-17', @hsd = '2023-06-17', @ngaynhapkho ='2023-04-20', @loaikho = 1, @sltonkho = 150; 
EXEC sp_NhapKho @masp = 30, @nsx = '2023-04-17', @hsd = '2023-06-17', @ngaynhapkho ='2023-04-20', @loaikho = 1, @sltonkho = 150; 
EXEC sp_NhapKho @masp = 31, @nsx = '2023-04-17', @hsd = '2023-06-17', @ngaynhapkho ='2023-04-20', @loaikho = 1, @sltonkho = 150; 
EXEC sp_NhapKho @masp = 32, @nsx = '2023-04-17', @hsd = '2023-06-17', @ngaynhapkho ='2023-04-20', @loaikho = 1, @sltonkho = 150; 
EXEC sp_NhapKho @masp = 33, @nsx = '2023-04-17', @hsd = '2023-06-17', @ngaynhapkho ='2023-04-20', @loaikho = 1, @sltonkho = 150; 
EXEC sp_NhapKho @masp = 34, @nsx = '2023-04-17', @hsd = '2023-06-17', @ngaynhapkho ='2023-04-20', @loaikho = 1, @sltonkho = 150; 
EXEC sp_NhapKho @masp = 35, @nsx = '2023-04-17', @hsd = '2023-06-17', @ngaynhapkho ='2023-04-20', @loaikho = 1, @sltonkho = 150; 
EXEC sp_NhapKho @masp = 36, @nsx = '2023-04-17', @hsd = '2023-06-17', @ngaynhapkho ='2023-04-20', @loaikho = 1, @sltonkho = 100; 
EXEC sp_NhapKho @masp = 37, @nsx = '2023-04-17', @hsd = '2023-06-17', @ngaynhapkho ='2023-04-20', @loaikho = 1, @sltonkho = 100; 
EXEC sp_NhapKho @masp = 38, @nsx = '2023-04-17', @hsd = '2023-06-17', @ngaynhapkho ='2023-04-20', @loaikho = 1, @sltonkho = 100; 
EXEC sp_NhapKho @masp = 39, @nsx = '2023-04-17', @hsd = '2023-06-17', @ngaynhapkho ='2023-04-20', @loaikho = 1, @sltonkho = 100; 
EXEC sp_NhapKho @masp = 40, @nsx = '2023-04-17', @hsd = '2023-06-17', @ngaynhapkho ='2023-04-20', @loaikho = 1, @sltonkho = 130; 
EXEC sp_NhapKho @masp = 41, @nsx = '2023-04-17', @hsd = '2023-06-17', @ngaynhapkho ='2023-04-20', @loaikho = 1, @sltonkho = 150; 
GO

EXEC sp_XuatKho @masp = 01, @nsx = '2023-04-17', @hsd = '2023-06-17', @ngayxuatkho = '2023-04-21', @soluong = 110;
EXEC sp_XuatKho @masp = 02, @nsx = '2023-04-17', @hsd = '2023-06-17', @ngayxuatkho = '2023-04-21', @soluong = 100;
EXEC sp_XuatKho @masp = 03, @nsx = '2023-04-17', @hsd = '2023-06-17', @ngayxuatkho = '2023-04-21', @soluong = 100;
EXEC sp_XuatKho @masp = 04, @nsx = '2023-04-17', @hsd = '2023-06-17', @ngayxuatkho = '2023-04-21', @soluong = 100;
EXEC sp_XuatKho @masp = 05, @nsx = '2023-04-17', @hsd = '2023-06-17', @ngayxuatkho = '2023-04-21', @soluong = 100;
EXEC sp_XuatKho @masp = 06, @nsx = '2023-04-17', @hsd = '2023-06-17', @ngayxuatkho = '2023-04-21', @soluong = 100;
EXEC sp_XuatKho @masp = 07, @nsx = '2023-04-17', @hsd = '2023-06-17', @ngayxuatkho = '2023-04-21', @soluong = 100;
EXEC sp_XuatKho @masp = 08, @nsx = '2023-04-17', @hsd = '2023-06-17', @ngayxuatkho = '2023-04-21', @soluong = 100;
EXEC sp_XuatKho @masp = 09, @nsx = '2023-04-17', @hsd = '2023-06-17', @ngayxuatkho = '2023-04-21', @soluong = 100;
EXEC sp_XuatKho @masp = 10, @nsx = '2023-04-17', @hsd = '2023-06-17', @ngayxuatkho = '2023-04-21', @soluong = 100;
EXEC sp_XuatKho @masp = 11, @nsx = '2023-04-17', @hsd = '2023-06-17', @ngayxuatkho = '2023-04-21', @soluong = 100;
EXEC sp_XuatKho @masp = 12, @nsx = '2023-04-17', @hsd = '2023-06-17', @ngayxuatkho = '2023-04-21', @soluong = 100;
EXEC sp_XuatKho @masp = 13, @nsx = '2023-04-17', @hsd = '2023-06-17', @ngayxuatkho = '2023-04-21', @soluong = 100;
EXEC sp_XuatKho @masp = 14, @nsx = '2023-04-17', @hsd = '2023-06-17', @ngayxuatkho = '2023-04-21', @soluong = 100;
EXEC sp_XuatKho @masp = 15, @nsx = '2023-04-17', @hsd = '2023-06-17', @ngayxuatkho = '2023-04-21', @soluong = 100;
EXEC sp_XuatKho @masp = 16, @nsx = '2023-04-17', @hsd = '2023-06-17', @ngayxuatkho = '2023-04-21', @soluong = 100;
EXEC sp_XuatKho @masp = 17, @nsx = '2023-04-17', @hsd = '2023-06-17', @ngayxuatkho = '2023-04-21', @soluong = 100;
EXEC sp_XuatKho @masp = 18, @nsx = '2023-04-17', @hsd = '2023-06-17', @ngayxuatkho = '2023-04-21', @soluong = 100;
EXEC sp_XuatKho @masp = 19, @nsx = '2023-04-17', @hsd = '2023-06-17', @ngayxuatkho = '2023-04-21', @soluong = 100;
EXEC sp_XuatKho @masp = 20, @nsx = '2023-04-17', @hsd = '2023-06-17', @ngayxuatkho = '2023-04-21', @soluong = 100;
EXEC sp_XuatKho @masp = 21, @nsx = '2023-04-17', @hsd = '2023-06-17', @ngayxuatkho = '2023-04-21', @soluong = 100;
EXEC sp_XuatKho @masp = 22, @nsx = '2023-04-17', @hsd = '2023-06-17', @ngayxuatkho = '2023-04-21', @soluong = 100;
EXEC sp_XuatKho @masp = 23, @nsx = '2023-04-17', @hsd = '2023-06-17', @ngayxuatkho = '2023-04-21', @soluong = 100;
EXEC sp_XuatKho @masp = 24, @nsx = '2023-04-17', @hsd = '2023-06-17', @ngayxuatkho = '2023-04-21', @soluong = 100;
EXEC sp_XuatKho @masp = 25, @nsx = '2023-04-17', @hsd = '2023-06-17', @ngayxuatkho = '2023-04-21', @soluong = 100;
EXEC sp_XuatKho @masp = 26, @nsx = '2023-04-17', @hsd = '2023-06-17', @ngayxuatkho = '2023-04-21', @soluong = 100;
EXEC sp_XuatKho @masp = 27, @nsx = '2023-04-17', @hsd = '2023-06-17', @ngayxuatkho = '2023-04-21', @soluong = 100;
EXEC sp_XuatKho @masp = 28, @nsx = '2023-04-17', @hsd = '2023-06-17', @ngayxuatkho = '2023-04-21', @soluong = 100;
EXEC sp_XuatKho @masp = 29, @nsx = '2023-04-17', @hsd = '2023-06-17', @ngayxuatkho = '2023-04-21', @soluong = 100;
EXEC sp_XuatKho @masp = 30, @nsx = '2023-04-17', @hsd = '2023-06-17', @ngayxuatkho = '2023-04-21', @soluong = 100;
EXEC sp_XuatKho @masp = 31, @nsx = '2023-04-17', @hsd = '2023-06-17', @ngayxuatkho = '2023-04-21', @soluong = 100;
EXEC sp_XuatKho @masp = 32, @nsx = '2023-04-17', @hsd = '2023-06-17', @ngayxuatkho = '2023-04-21', @soluong = 100;
EXEC sp_XuatKho @masp = 33, @nsx = '2023-04-17', @hsd = '2023-06-17', @ngayxuatkho = '2023-04-21', @soluong = 100;
EXEC sp_XuatKho @masp = 34, @nsx = '2023-04-17', @hsd = '2023-06-17', @ngayxuatkho = '2023-04-21', @soluong = 100;
EXEC sp_XuatKho @masp = 35, @nsx = '2023-04-17', @hsd = '2023-06-17', @ngayxuatkho = '2023-04-21', @soluong = 100;
EXEC sp_XuatKho @masp = 36, @nsx = '2023-04-17', @hsd = '2023-06-17', @ngayxuatkho = '2023-04-21', @soluong = 100;
EXEC sp_XuatKho @masp = 37, @nsx = '2023-04-17', @hsd = '2023-06-17', @ngayxuatkho = '2023-04-21', @soluong = 100;
EXEC sp_XuatKho @masp = 38, @nsx = '2023-04-17', @hsd = '2023-06-17', @ngayxuatkho = '2023-04-21', @soluong = 100;
EXEC sp_XuatKho @masp = 39, @nsx = '2023-04-17', @hsd = '2023-06-17', @ngayxuatkho = '2023-04-21', @soluong = 100;
EXEC sp_XuatKho @masp = 40, @nsx = '2023-04-17', @hsd = '2023-06-17', @ngayxuatkho = '2023-04-21', @soluong = 100;
EXEC sp_XuatKho @masp = 41, @nsx = '2023-04-17', @hsd = '2023-06-17', @ngayxuatkho = '2023-04-21', @soluong = 100;
GO

EXEC dbo.sp_ThemChiTietHoaDon @mahd = 01, @masp = 01, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 5;
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 01, @masp = 01, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 5;
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 01, @masp = 02, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 3;
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 01, @masp = 03, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 2;
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 01, @masp = 04, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 4;
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 01, @masp = 05, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 6;
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 02, @masp = 06, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 7;
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 02, @masp = 07, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 9;
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 02, @masp = 08, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 2;
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 02, @masp = 09, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 5;
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 03, @masp = 10, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 1;
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 03, @masp = 11, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 2;
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 03, @masp = 12, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 3;
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 03, @masp = 13, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 4;
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 03, @masp = 14, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 1;
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 04, @masp = 15, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 3;
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 04, @masp = 16, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 8; 
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 04, @masp = 17, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 1;
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 04, @masp = 18, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 2;
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 04, @masp = 19, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 3;
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 05, @masp = 20, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 5;
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 05, @masp = 21, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 9;
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 05, @masp = 22, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 2;
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 06, @masp = 02, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 5;
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 06, @masp = 06, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 7;
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 07, @masp = 14, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 2;
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 07, @masp = 17, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 5;
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 07, @masp = 19, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 3;
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 08, @masp = 14, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 2;
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 08, @masp = 17, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 5;
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 08, @masp = 19, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 3;
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 09, @masp = 05, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 6;
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 09, @masp = 07, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 4; 
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 10, @masp = 03, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 3; 
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 10, @masp = 05, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 2;
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 10, @masp = 11, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 1;
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 11, @masp = 08, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 4;
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 11, @masp = 10, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 2;
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 11, @masp = 12, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 3;
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 12, @masp = 02, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 5;
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 12, @masp = 06, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 7;
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 12, @masp = 07, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 3;
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 13, @masp = 13, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 2;
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 13, @masp = 18, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 3;
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 13, @masp = 19, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 1;
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 14, @masp = 04, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 3;
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 14, @masp = 06, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 2;
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 14, @masp = 07, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 1;
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 15, @masp = 10, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 4;
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 15, @masp = 15, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 2;
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 15, @masp = 17, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 3;
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 16, @masp = 03, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 4;
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 16, @masp = 04, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 3;
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 16, @masp = 05, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 2;
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 16, @masp = 07, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 1;
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 17, @masp = 01, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 6;
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 17, @masp = 02, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 4;
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 17, @masp = 03, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 2;
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 17, @masp = 04, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 3;
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 18, @masp = 05, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 5;
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 18, @masp = 06, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 8;
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 19, @masp = 02, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 9;
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 19, @masp = 04, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 6;
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 20, @masp = 10, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 4;
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 20, @masp = 15, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 2;
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 20, @masp = 17, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 3;
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 21, @masp = 23, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 2;
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 21, @masp = 24, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 3;
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 21, @masp = 25, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 1;
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 22, @masp = 10, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 2;
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 22, @masp = 21, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 3;
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 22, @masp = 22, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 1;
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 22, @masp = 24, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 4;
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 22, @masp = 27, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 2;
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 23, @masp = 11, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 1;
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 23, @masp = 16, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 2;
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 23, @masp = 17, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 3;
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 23, @masp = 23, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 5; 
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 23, @masp = 25, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 1; 
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 24, @masp = 12, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 2; 
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 24, @masp = 18, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 1; 
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 24, @masp = 20, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 1;
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 24, @masp = 26, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 3; 
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 24, @masp = 27, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 5; 
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 25, @masp = 05, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 1;
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 25, @masp = 19, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 1; 
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 25, @masp = 22, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 3;
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 25, @masp = 24, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 6; 
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 26, @masp = 20, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 2; 
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 27, @masp = 33, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 1;
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 27, @masp = 40, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 2; 
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 27, @masp = 41, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 3; 
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 28, @masp = 38, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 2; 
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 28, @masp = 39, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 1; 
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 29, @masp = 34, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 4; 
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 29, @masp = 35, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 3; 
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 30, @masp = 40, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 1; 
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 30, @masp = 37, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 2; 
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 31, @masp = 36, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 5; 
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 31, @masp = 40, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 1; 
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 32, @masp = 32, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 2; 
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 32, @masp = 39, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 2; 
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 33, @masp = 31, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 4; 
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 33, @masp = 33, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 2; 
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 33, @masp = 37, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 1; 
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 34, @masp = 38, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 3; 
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 34, @masp = 41, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 1; 
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 35, @masp = 35, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 2; 
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 36, @masp = 38, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 1; 
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 37, @masp = 31, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 2; 
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 37, @masp = 37, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 1; 
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 37, @masp = 39, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 3; 
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 38, @masp = 33, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 4; 
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 38, @masp = 34, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 2; 
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 38, @masp = 39, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 1; 
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 39, @masp = 40, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 2; 
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 39, @masp = 41, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 3; 
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 39, @masp = 39, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 1; 
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 40, @masp = 30, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 1;
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 40, @masp = 35, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 2; 
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 40, @masp = 40, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 3;
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 41, @masp = 32, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 2;
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 41, @masp = 38, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 2;
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 42, @masp = 39, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 3; 
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 42, @masp = 41, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 2; 
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 42, @masp = 39, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 1; 
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 43, @masp = 34, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 4; 
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 43, @masp = 37, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 2;
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 43, @masp = 41, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 1;
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 44, @masp = 31, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 3; 
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 44, @masp = 32, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 2; 
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 44, @masp = 33, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 1;
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 45, @masp = 08, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 3;
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 45, @masp = 12, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 1; 
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 45, @masp = 14, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 4;
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 46, @masp = 03, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 3;
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 46, @masp = 07, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 2;
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 46, @masp = 11, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 5; 
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 46, @masp = 12, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 1; 
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 46, @masp = 13, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 3; 
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 47, @masp = 02, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 5;
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 47, @masp = 05, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 2;
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 47, @masp = 12, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 4; 
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 47, @masp = 13, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 1; 
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 47, @masp = 14, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 2; 
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 48, @masp = 01, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 1;
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 48, @masp = 02, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 1;
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 48, @masp = 03, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 1;
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 48, @masp = 04, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 1;
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 48, @masp = 05, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 1;
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 49, @masp = 07, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 1;
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 49, @masp = 10, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 3; 
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 49, @masp = 11, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 2;
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 49, @masp = 13, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 1;
EXEC dbo.sp_ThemChiTietHoaDon @mahd = 50, @masp = 11, @nsx = '2023-04-17', @hsd = '2023-06-17',  @sl = 1; 
GO

UPDATE dbo.HoaDon SET MaNV = 'NV00001', Sdtkh = '0123456701', PTTT = 1 WHERE MaHD = 01
UPDATE dbo.HoaDon SET MaNV = 'NV00002', Sdtkh = '0123456702', PTTT = 2 WHERE MaHD = 02
UPDATE dbo.HoaDon SET MaNV = 'NV00003', Sdtkh = '0123456703', PTTT = 3 WHERE MaHD = 03
UPDATE dbo.HoaDon SET MaNV = 'NV00004', Sdtkh = '0123456704', PTTT = 1 WHERE MaHD = 04
UPDATE dbo.HoaDon SET MaNV = 'NV00005', Sdtkh = '0123456705', PTTT = 2 WHERE MaHD = 05
UPDATE dbo.HoaDon SET MaNV = 'NV00006', Sdtkh = '0123456706', PTTT = 3 WHERE MaHD = 06
UPDATE dbo.HoaDon SET MaNV = 'NV00007', Sdtkh = '0123456707', PTTT = 1 WHERE MaHD = 07
UPDATE dbo.HoaDon SET MaNV = 'NV00008', Sdtkh = '0123456708', PTTT = 2 WHERE MaHD = 08
UPDATE dbo.HoaDon SET MaNV = 'NV00009', Sdtkh = '0123456709', PTTT = 3 WHERE MaHD = 09
UPDATE dbo.HoaDon SET MaNV = 'NV00010', Sdtkh = '0123456710', PTTT = 1 WHERE MaHD = 10
UPDATE dbo.HoaDon SET MaNV = 'NV00011', Sdtkh = '0123456711', PTTT = 2 WHERE MaHD = 11
UPDATE dbo.HoaDon SET MaNV = 'NV00012', Sdtkh = '0123456712', PTTT = 3 WHERE MaHD = 12
UPDATE dbo.HoaDon SET MaNV = 'NV00013', Sdtkh = '0123456713', PTTT = 1 WHERE MaHD = 13
UPDATE dbo.HoaDon SET MaNV = 'NV00014', Sdtkh = '0123456714', PTTT = 2 WHERE MaHD = 14
UPDATE dbo.HoaDon SET MaNV = 'NV00015', Sdtkh = '0123456715', PTTT = 3 WHERE MaHD = 15
UPDATE dbo.HoaDon SET MaNV = 'NV00016', Sdtkh = '0123456716', PTTT = 1 WHERE MaHD = 16
UPDATE dbo.HoaDon SET MaNV = 'NV00001', Sdtkh = '0123456717', PTTT = 2 WHERE MaHD = 17
UPDATE dbo.HoaDon SET MaNV = 'NV00002', Sdtkh = '0123456718', PTTT = 3 WHERE MaHD = 18
UPDATE dbo.HoaDon SET MaNV = 'NV00003', Sdtkh = '0123456719', PTTT = 1 WHERE MaHD = 19
UPDATE dbo.HoaDon SET MaNV = 'NV00004', Sdtkh = '0123456720', PTTT = 2 WHERE MaHD = 20
UPDATE dbo.HoaDon SET MaNV = 'NV00005', Sdtkh = '0123456721', PTTT = 3 WHERE MaHD = 21
UPDATE dbo.HoaDon SET MaNV = 'NV00006', Sdtkh = '0123456722', PTTT = 1 WHERE MaHD = 22
UPDATE dbo.HoaDon SET MaNV = 'NV00007', Sdtkh = '0123456723', PTTT = 2 WHERE MaHD = 23
UPDATE dbo.HoaDon SET MaNV = 'NV00008', Sdtkh = '0123456724', PTTT = 3 WHERE MaHD = 24
UPDATE dbo.HoaDon SET MaNV = 'NV00009', Sdtkh = '0123456725', PTTT = 1 WHERE MaHD = 25
UPDATE dbo.HoaDon SET MaNV = 'NV00010', Sdtkh = '0123456726', PTTT = 2 WHERE MaHD = 26
UPDATE dbo.HoaDon SET MaNV = 'NV00011', Sdtkh = '0123456727', PTTT = 3 WHERE MaHD = 27
UPDATE dbo.HoaDon SET MaNV = 'NV00012', Sdtkh = '0123456728', PTTT = 1 WHERE MaHD = 28
UPDATE dbo.HoaDon SET MaNV = 'NV00013', Sdtkh = '0123456729', PTTT = 2 WHERE MaHD = 29
UPDATE dbo.HoaDon SET MaNV = 'NV00014', Sdtkh = '0123456730', PTTT = 3 WHERE MaHD = 30
UPDATE dbo.HoaDon SET MaNV = 'NV00015', Sdtkh = '0123456731', PTTT = 1 WHERE MaHD = 31
UPDATE dbo.HoaDon SET MaNV = 'NV00016', Sdtkh = '0123456732', PTTT = 2 WHERE MaHD = 32
UPDATE dbo.HoaDon SET MaNV = 'NV00001', Sdtkh = '0123456733', PTTT = 3 WHERE MaHD = 33
UPDATE dbo.HoaDon SET MaNV = 'NV00002', Sdtkh = '0123456734', PTTT = 1 WHERE MaHD = 34
UPDATE dbo.HoaDon SET MaNV = 'NV00003', Sdtkh = '0123456735', PTTT = 2 WHERE MaHD = 35
UPDATE dbo.HoaDon SET MaNV = 'NV00004', Sdtkh = '0123456701', PTTT = 3 WHERE MaHD = 36
UPDATE dbo.HoaDon SET MaNV = 'NV00005', Sdtkh = '0123456702', PTTT = 1 WHERE MaHD = 37
UPDATE dbo.HoaDon SET MaNV = 'NV00006', Sdtkh = '0123456703', PTTT = 2 WHERE MaHD = 38
UPDATE dbo.HoaDon SET MaNV = 'NV00007', Sdtkh = '0123456704', PTTT = 3 WHERE MaHD = 39
UPDATE dbo.HoaDon SET MaNV = 'NV00008', Sdtkh = '0123456705', PTTT = 1 WHERE MaHD = 40
UPDATE dbo.HoaDon SET MaNV = 'NV00009', Sdtkh = '0123456706', PTTT = 2 WHERE MaHD = 41
UPDATE dbo.HoaDon SET MaNV = 'NV00010', Sdtkh = '0123456707', PTTT = 3 WHERE MaHD = 42
UPDATE dbo.HoaDon SET MaNV = 'NV00011', Sdtkh = '0123456708', PTTT = 1 WHERE MaHD = 43
UPDATE dbo.HoaDon SET MaNV = 'NV00012', Sdtkh = '0123456709', PTTT = 2 WHERE MaHD = 44
UPDATE dbo.HoaDon SET MaNV = 'NV00013', Sdtkh = '0123456710', PTTT = 3 WHERE MaHD = 45
UPDATE dbo.HoaDon SET MaNV = 'NV00014', Sdtkh = '0123456711', PTTT = 1 WHERE MaHD = 46
UPDATE dbo.HoaDon SET MaNV = 'NV00015', Sdtkh = '0123456712', PTTT = 2 WHERE MaHD = 47
UPDATE dbo.HoaDon SET MaNV = 'NV00016', Sdtkh = '0123456713', PTTT = 3 WHERE MaHD = 48
UPDATE dbo.HoaDon SET MaNV = 'NV00001', Sdtkh = '0123456714', PTTT = 1 WHERE MaHD = 49
UPDATE dbo.HoaDon SET MaNV = 'NV00002', Sdtkh = '0123456715', PTTT = 2 WHERE MaHD = 50

INSERT INTO dbo.PhuongThucThanhToan
(
    PTTT,
    TenPTTT
)
VALUES
(1,  N'Tiền Mặt'),
(2,  N'Chuyển khoản'),
(3,  N'Thẻ')
GO