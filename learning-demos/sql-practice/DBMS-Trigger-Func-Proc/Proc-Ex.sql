CREATE DATABASE QuanLyCuaHangTienLoi
GO

USE QuanLyCuaHangTienLoi
GO

CREATE TABLE dbo.NhanVien(
	MaNV NVARCHAR(10) PRIMARY KEY,
	TenNV NVARCHAR(255) NOT NULL,
	Sdt NVARCHAR(10) NOT NULL,
	Phai NVARCHAR(255) NOT NULL,
	Tuoi INT NOT NULL,
	NgaySinh DATE NOT NULL,
	Email NVARCHAR(255) NOT NULL
)
GO

CREATE TABLE dbo.TaiKhoan(
	MaNV NVARCHAR(10) REFERENCES dbo.NhanVien(MaNV) ON DELETE SET NULL ON UPDATE CASCADE NULL,
	TenTK NVARCHAR(255) PRIMARY KEY,
	MatKhau NVARCHAR(255) NOT NULL
)
GO

CREATE TABLE dbo.ChucVu(
	MaCV NVARCHAR(10) PRIMARY KEY,
	TenCV NVARCHAR(255) NOT NULL
)
GO

CREATE TABLE dbo.Ca(
	MaCa NVARCHAR(10) PRIMARY KEY,
	LoaiCa NVARCHAR(255) NOT NULL,
	GioBatDau DATE NOT NULL,
	GioKetThuc DATE NOT NULL
)
GO

CREATE TABLE dbo.PhanCong(
	MaNV NVARCHAR(10) REFERENCES dbo.NhanVien(MaNV) ON DELETE CASCADE ON UPDATE CASCADE NOT NULL,
	MaCa NVARCHAR(10) REFERENCES dbo.Ca(MaCa) ON DELETE CASCADE ON UPDATE CASCADE NOT NULL,
	MaCV NVARCHAR(10) REFERENCES dbo.ChucVu(MaCV) ON DELETE CASCADE ON UPDATE CASCADE NOT NULL,
	NgayDangKy DATE NOT NULL,
	PRIMARY KEY (MaNV, MaCa, MaCV, NgayDangKy)
)
GO

CREATE TABLE dbo.ChamCong(
	MaNV NVARCHAR(10) REFERENCES dbo.NhanVien(MaNV) ON DELETE SET NULL ON UPDATE CASCADE NULL,
	MaCa NVARCHAR(10) REFERENCES dbo.Ca(MaCa) ON DELETE SET NULL ON UPDATE CASCADE NULL,
	Ngay DATE NOT NULL,
	GioBD TIME NOT NULL,
	GioKT TIME NULL
)
GO

CREATE TABLE dbo.NhaSanXuat(
	MaNSX NVARCHAR(10) PRIMARY KEY,
	TenNSX NVARCHAR(255) NOT NULL,
	DiaChi NVARCHAR(255) NOT NULL
)
GO

CREATE TABLE dbo.LoaiSanPham(
	MaLoai NVARCHAR(10) PRIMARY KEY,
	TenLoai NVARCHAR(255) NOT NULL
)
GO

CREATE TABLE dbo.SanPham(
	MaSP NVARCHAR(10) PRIMARY KEY,
	TenSP NVARCHAR(255) NOT NULL,
	MaNSX NVARCHAR(10) REFERENCES dbo.NhaSanXuat(MaNSX) ON DELETE SET NULL ON UPDATE CASCADE NULL,
	MaLoai NVARCHAR(10) REFERENCES dbo.LoaiSanPham(MaLoai) ON DELETE SET NULL ON UPDATE CASCADE NULL,
	GiaBan FLOAT NOT NULL,
	GiaGoc FLOAT NOT NULL
)
GO

CREATE TABLE dbo.Kho
(
	MaSP NVARCHAR(10) REFERENCES dbo.SanPham(MaSP) ON DELETE CASCADE ON UPDATE CASCADE NOT NULL,
	NgayNhapKho DATE NOT NULL,
	LoaiKho NVARCHAR(255) NOT NULL,
	SLTonKho INT NOT NULL,
	HSD DATE NOT NULL,
	NSX DATE NOT NULL,
	PRIMARY KEY (MaSP, NgayNhapKho)
)
GO

CREATE TABLE dbo.CuaHang
(
	MaSP NVARCHAR(10) REFERENCES dbo.SanPham(MaSP) ON DELETE CASCADE ON UPDATE CASCADE NOT NULL,
	NgayXuatKho DATE NOT NULL,
	SoLuong INT NOT NULL,
	PRIMARY KEY (MaSP, NgayXuatKho)
)
GO

CREATE TABLE dbo.KhachHang
(
	MaKH NVARCHAR(10) PRIMARY KEY,
	TenKH NVARCHAR(255) NOT NULL,
	DiemTichLuy INT NOT NULL
)
GO

CREATE TABLE dbo.NgayLe(
	MaNL NVARCHAR(10) PRIMARY KEY,
	Ngay DATE NOT NULL,
	SuKien NVARCHAR(255) NOT NULL
)
GO

CREATE TABLE dbo.HoaDon
(
	MaHD NVARCHAR(10) PRIMARY KEY,
	MaNV NVARCHAR(10) REFERENCES dbo.NhanVien(MaNV) ON DELETE SET NULL ON UPDATE CASCADE NULL,
	MaKH NVARCHAR(10) REFERENCES dbo.KhachHang(MaKH) ON DELETE SET NULL ON UPDATE CASCADE NULL,
	PTTT NVARCHAR(255) NOT NULL,
	Ngay DATE NOT NULL,
	TongTienTT FLOAT NOT NULL
)
GO

CREATE TABLE dbo.ChiTietHoaDon
(
	MaHD NVARCHAR(10) REFERENCES dbo. HoaDon(MaHD) ON DELETE CASCADE ON UPDATE CASCADE NOT NULL,
	MaSP NVARCHAR(10) REFERENCES dbo.SanPham(MaSP) ON DELETE CASCADE ON UPDATE CASCADE NOT NULL,
	SoLuong INT NOT NULL,
	GiaBan FLOAT NOT NULL,
	GiaGoc FLOAT NOT NULL,
	ThanhTien FLOAT NOT NULL,
	TienLoi FLOAT NOT NULL,
	PRIMARY KEY (MaHD, MaSP)
)
GO

CREATE TABLE dbo.TinhLuong
(
	MaNV NVARCHAR(10) REFERENCES dbo.NhanVien(MaNV) ON DELETE CASCADE ON UPDATE CASCADE NOT NULL,
	MaCV NVARCHAR(10) REFERENCES dbo.ChucVu(MaCV) ON DELETE CASCADE ON UPDATE CASCADE NOT NULL,
	MaCa NVARCHAR(10) REFERENCES dbo.Ca(MaCa) ON DELETE CASCADE ON UPDATE CASCADE NOT NULL,
	MaNL NVARCHAR(10) REFERENCES dbo.NgayLe(MaNL) ON DELETE CASCADE ON UPDATE CASCADE NOT NULL,
	Ngay DATE NOT NULL,
	LuongTheoGio INT NOT NULL,
	LuongCuoiNgay INT NOT NULL,
	LuongThuong INT NOT NULL,
	PRIMARY KEY (MaNV, MaCV, MaCa, Ngay)
)
GO

INSERT INTO dbo.NhanVien(MaNV, TenNV, Sdt, Phai, Tuoi, NgaySinh, Email)
VALUES ('NV001', N'Nguyễn Văn Hưng', '0987654321', N'Nam', 28, '1995-01-01', 'nv.a@gmail.com'),
		('NV002', N'Nguyễn Thị Mai', '0123456781', N'Nữ', 25, '1998-05-02', 'nv.b@gmail.com'),
		('NV003', N'Phạm Văn Đức', '0123456782', N'Nam', 30, '1991-08-04', 'nv.c@gmail.com'),
		('NV004', N'Trần Thị Trang', '0123456783', N'Nữ', 27, '1994-06-05', 'nv.d@gmail.com'),
		('NV005', N'Lê Văn Bình', '0123456784', N'Nam', 32, '1989-09-06', 'nv.e@gmail.com'),
		('NV006', N'Nguyễn Thị Tuyết', '0123456785', N'Nữ', 23, '1998-11-07', 'nv.f@gmail.com'),
		('NV007', N'Trần Đức Thắng', '0123456786', N'Nam', 29, '1992-12-08', 'nv.g@gmail.com'),
		('NV008', N'Nguyễn Thị Hoa', '0123456787', N'Nữ', 24, '1997-02-09', 'nv.h@gmail.com'),
		('NV009', N'Lê Văn Đông', '0123456788', N'Nam', 26, '1995-03-10', 'nv.i@gmail.com'),
		('NV010', N'Trần Thị Anh', '0123456789', N'Nữ', 31, '1990-04-11', 'nv.j@gmail.com'),
		('NV011', N'Phạm Văn Hùng', '0123456790', N'Nam', 28, '1993-05-12', 'nv.k@gmail.com'),
		('NV012', N'Nguyễn Thị Thu', '0123456791', N'Nữ', 26, '1995-06-13', 'nv.l@gmail.com'),
		('NV013', N'Lê Đức Thắng', '0123456792', N'Nam', 29, '1992-07-14', 'nv.m@gmail.com'),
		('NV014', N'Phạm Thị Hoa', '0123456793', N'Nữ', 27, '1994-08-15', 'nv.n@gmail.com'),
		('NV015', N'Trần Văn Hòa', '0123456794', N'Nam', 30, '1991-09-16', 'nv.o@gmail.com'),
		('NV016', N'Lê Thị An', '0123456795', N'Nữ', 25, '1996-10-17', 'nv.p@gmail.com')
GO

INSERT INTO dbo.TaiKhoan(MaNV, TenTK, MatKhau)
VALUES ('NV001', 'nv.a', '123456'),
	('NV002', 'nv.b', '123456'),
	('NV003', 'nv.c', '123456'),
	('NV004', 'nv.d', '123456'),
	('NV005', 'nv.e', '123456'),
	('NV006', 'nv.f', '123456'),
	('NV007', 'nv.g', '123456'),
	('NV008', 'nv.h', '123456'),
	('NV009', 'nv.i', '123456'),
	('NV010', 'nv.j', '123456'),
	('NV011', 'nv.k', '123456'),
	('NV012', 'nv.l', '123456'),
	('NV013', 'nv.m', '123456'),
	('NV014', 'nv.n', '123456'),
	('NV015', 'nv.o', '123456'),
	('NV016', 'nv.p', '123456')
GO


INSERT INTO dbo.ChucVu(MaCV, TenCV)
VALUES ('CV001', N'Nhân viên Full-time'),
		('CV002', N'Nhân viên Part-time'),
		('CV003', N'Bảo vệ'),
		('CV004', N'Quản lý'),
		('CV005', N'Chủ cửa hàng')
GO

INSERT INTO dbo.Ca(MaCa, LoaiCa, GioBatDau, GioKetThuc)
VALUES ('A1', N'Sáng', '06:00:00', '10:00:00'),
		('A2', N'Sáng', '10:00:00', '14:00:00'),
		('B1', N'Sáng', '14:00:00', '18:00:00'),
		('B2', N'Sáng', '18:00:00', '22:00:00'),
		('C', N'Tối', '22:00:00', '06:00:00')
GO

INSERT INTO dbo.NhaSanXuat(MaNSX, TenNSX, DiaChi)
VALUES ('NSX001', N'Unilever', N'Hà Nội'),
		('NSX002', N'P&G', N'Hồ Chí Minh'),
		('NSX003', N'Masan', N'Hà Nội'),
		('NSX004', N'Nestle', N'Hồ Chí Minh'),
		('NSX005', N'Vinamilk', N'Hồ Chí Minh')
GO

CREATE PROC USP_ThemNhanVien
@manv NVARCHAR(10), @tennv NVARCHAR(255), @sdt NVARCHAR(10), @phai NVARCHAR(255), @tuoi int, @ngaysinh DATE, @email NVARCHAR(255)
AS
BEGIN
	INSERT INTO dbo.NhanVien
	(
		MaNV,
		TenNV,
		Sdt,
		Phai,
		Tuoi,
		NgaySinh,
		Email
	)
	VALUES
	(   @manv,       -- MaNV - nvarchar(10)
		@tennv,       -- TenNV - nvarchar(255)
		@sdt,       -- Sdt - nvarchar(10)
		@phai,       -- Phai - nvarchar(255)
		@tuoi,         -- Tuoi - int
		@ngaysinh, -- NgaySinh - date
		@email        -- Email - nvarchar(255)
    )
END
GO

CREATE PROC USP_XoaNhanVien
@manv NVARCHAR(10)
AS
BEGIN
	DELETE FROM dbo.NhanVien
	WHERE MaNV = @manv
END
GO

CREATE PROC USP_SuaNhanVien
@manv NVARCHAR(10), @tennv NVARCHAR(255), @sdt NVARCHAR(10), @phai NVARCHAR(255), @tuoi int, @ngaysinh DATE, @email NVARCHAR(255)
AS
BEGIN
	UPDATE dbo.NhanVien
	SET
		TenNV = @tennv,
		Sdt = @sdt,
		Phai = @phai,
		Tuoi = @tuoi,
		NgaySinh = @ngaysinh,
		Email = @email
	WHERE MaNV = @manv
END
GO