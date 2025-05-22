CREATE DATABASE QuanLyTruongHoc
GO

USE QuanLyTruongHoc
GO

CREATE TABLE HocSinh
(
	MaHS NVARCHAR(255) PRIMARY KEY,
	Ten NVARCHAR(255) NOT NULL,
	QueQuan NVARCHAR(255) NOT NULL,
	NgayThangNamSinh DATE NOT NULL,
	CMND NVARCHAR(255) NOT NULL,
	Email NVARCHAR(255) NOT NULL,
	SoDT NVARCHAR(255) NOT NULL,
	Diem FLOAT DEFAULT 0
)
GO

CREATE TABLE GiaoVien
(
	MaGV NVARCHAR(255) PRIMARY KEY,
	Ten NVARCHAR(255) NOT NULL,
	QueQuan NVARCHAR(255) NOT NULL,
	NgayThangNamSinh DATE NOT NULL,
	CMND NVARCHAR(255) NOT NULL,
	Email NVARCHAR(255) NOT NULL,
	SoDT NVARCHAR(255) NOT NULL
)
GO

INSERT INTO dbo.HocSinh
(
    MaHS,
    Ten,
    QueQuan,
    NgayThangNamSinh,
    CMND,
    Email,
    SoDT,
    Diem
)
VALUES
(   N'HS01',       -- MaHS - nvarchar(255)
    N'Văn',       -- Ten - nvarchar(255)
    N'Đồng Nai',       -- QueQuan - nvarchar(255)
    '12-9-2003', -- NgayThangNamSinh - date
    N'01234567891',       -- CMND - nvarchar(255)
    N'hs01@gmail.com',       -- Email - nvarchar(255)
    N'0123456789',       -- SoDT - nvarchar(255)
    4.8       -- Diem - float
)
GO

INSERT INTO dbo.HocSinh
(
    MaHS,
    Ten,
    QueQuan,
    NgayThangNamSinh,
    CMND,
    Email,
    SoDT,
    Diem
)
VALUES
(   N'HS02',       -- MaHS - nvarchar(255)
    N'Quỳnh',       -- Ten - nvarchar(255)
    N'TP. HCM',       -- QueQuan - nvarchar(255)
    '2-28-2003', -- NgayThangNamSinh - date
    N'01234567892',       -- CMND - nvarchar(255)
    N'hs02@gmail.com',       -- Email - nvarchar(255)
    N'0123456780',       -- SoDT - nvarchar(255)
    9.3       -- Diem - float
)
GO

INSERT INTO dbo.HocSinh
(
    MaHS,
    Ten,
    QueQuan,
    NgayThangNamSinh,
    CMND,
    Email,
    SoDT,
    Diem
)
VALUES
(   N'HS03',       -- MaHS - nvarchar(255)
    N'Nguyên',       -- Ten - nvarchar(255)
    N'Lâm Đồng',       -- QueQuan - nvarchar(255)
    '5-24-2003', -- NgayThangNamSinh - date
    N'01234567893',       -- CMND - nvarchar(255)
    N'hs03@gmail.com',       -- Email - nvarchar(255)
    N'0123456782',       -- SoDT - nvarchar(255)
    6.7       -- Diem - float
)
GO

INSERT INTO dbo.HocSinh
(
    MaHS,
    Ten,
    QueQuan,
    NgayThangNamSinh,
    CMND,
    Email,
    SoDT,
    Diem
)
VALUES
(   N'HS04',       -- MaHS - nvarchar(255)
    N'Tứ',       -- Ten - nvarchar(255)
    N'Cao Bằng',       -- QueQuan - nvarchar(255)
    '4-26-2003', -- NgayThangNamSinh - date
    N'01234567894',       -- CMND - nvarchar(255)
    N'hs04@gmail.com',       -- Email - nvarchar(255)
    N'0123456784',       -- SoDT - nvarchar(255)
    8       -- Diem - float
)
GO

INSERT INTO dbo.HocSinh
(
    MaHS,
    Ten,
    QueQuan,
    NgayThangNamSinh,
    CMND,
    Email,
    SoDT,
    Diem
)
VALUES
(   N'HS05',       -- MaHS - nvarchar(255)
    N'Bá',       -- Ten - nvarchar(255)
    N'TP. HCM',       -- QueQuan - nvarchar(255)
    '12-30-2003', -- NgayThangNamSinh - date
    N'01234567895',       -- CMND - nvarchar(255)
    N'hs05@gmail.com',       -- Email - nvarchar(255)
    N'0123456785',       -- SoDT - nvarchar(255)
    4.5       -- Diem - float
)
GO

INSERT INTO dbo.GiaoVien
(
    MaGV,
    Ten,
    QueQuan,
    NgayThangNamSinh,
    CMND,
    Email,
    SoDT
)
VALUES
(   N'GV01',       -- MaGV - nvarchar(255)
    N'Trung',       -- Ten - nvarchar(255)
    N'Đà Lạt',       -- QueQuan - nvarchar(255)
    '4-12-1998', -- NgayThangNamSinh - date
    N'01234567891',       -- CMND - nvarchar(255)
    N'gv01@gmail.com',       -- Email - nvarchar(255)
    N'0123456789'        -- SoDT - nvarchar(255)
)
GO

INSERT INTO dbo.GiaoVien
(
    MaGV,
    Ten,
    QueQuan,
    NgayThangNamSinh,
    CMND,
    Email,
    SoDT
)
VALUES
(   N'GV02',       -- MaGV - nvarchar(255)
    N'Khoa',       -- Ten - nvarchar(255)
    N'Kiên Giang',       -- QueQuan - nvarchar(255)
    '5-31-1998', -- NgayThangNamSinh - date
    N'01234567892',       -- CMND - nvarchar(255)
    N'gv02@gmail.com',       -- Email - nvarchar(255)
    N'0123456782'        -- SoDT - nvarchar(255)
)
GO

INSERT INTO dbo.GiaoVien
(
    MaGV,
    Ten,
    QueQuan,
    NgayThangNamSinh,
    CMND,
    Email,
    SoDT
)
VALUES
(   N'GV03',       -- MaGV - nvarchar(255)
    N'Giao',       -- Ten - nvarchar(255)
    N'Hà Nội',       -- QueQuan - nvarchar(255)
    '12-28-1997', -- NgayThangNamSinh - date
    N'01234567893',       -- CMND - nvarchar(255)
    N'gv03@gmail.com',       -- Email - nvarchar(255)
    N'0123456783'        -- SoDT - nvarchar(255)
)
GO

INSERT INTO dbo.GiaoVien
(
    MaGV,
    Ten,
    QueQuan,
    NgayThangNamSinh,
    CMND,
    Email,
    SoDT
)
VALUES
(   N'GV04',       -- MaGV - nvarchar(255)
    N'Kiên',       -- Ten - nvarchar(255)
    N'TP. HCM',       -- QueQuan - nvarchar(255)
    '7-3-1995', -- NgayThangNamSinh - date
    N'01234567894',       -- CMND - nvarchar(255)
    N'gv04@gmail.com',       -- Email - nvarchar(255)
    N'0123456784'        -- SoDT - nvarchar(255)
)
GO

INSERT INTO dbo.GiaoVien
(
    MaGV,
    Ten,
    QueQuan,
    NgayThangNamSinh,
    CMND,
    Email,
    SoDT
)
VALUES
(   N'GV05',       -- MaGV - nvarchar(255)
    N'Hậu',       -- Ten - nvarchar(255)
    N'TP. HCM',       -- QueQuan - nvarchar(255)
    '8-5-1995', -- NgayThangNamSinh - date
    N'01234567895',       -- CMND - nvarchar(255)
    N'gv05@gmail.com',       -- Email - nvarchar(255)
    N'0123456785'        -- SoDT - nvarchar(255)
)
GO