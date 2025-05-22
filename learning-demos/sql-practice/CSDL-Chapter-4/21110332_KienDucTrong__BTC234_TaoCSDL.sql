-- Họ tên: Kiến Đức Trọng. MSSV: 21110332
-- Code tạo CSDL
-- Bài 2
create database ThuVien
go

use ThuVien
go

create table NXB(
	MaNXB char(5) primary key,
	TenNXB varchar(15) null,
	DiaChi varchar(15) null,
	SoDT char(10) null
)
go

create table DauSach(
	MaSach char(3) primary key,
	Tua varchar(15) null,
	MaNXB char(5) references NXB(MaNXB)
)
go

Create Table TacGia(
	MaSach char(3) references DauSach(MaSach),
	TenTG char(15),
	primary key (Masach, tenTG)
)
go

create table CuonSach(
	Masach char(3) references DauSach(MaSach),
	MaCuon char(3) primary key,
	ViTri char(3) null
)
go

create table DocGia(
	MaDG char(4) primary key,
	TenDG varchar(15) null,
	DiaChi varchar(15) null,
	SoDT char(10) null
)
go

create table Muon(
	MaCuon char(3) references CuonSach(MaCuon),
	MaDG char(4) references DocGia(MaDG),
	NgMuon date null,
	NgTra date null,
	primary key(MaCuon, MaDG)
)
go

alter table DauSach
	alter column Tua varchar(50) null
go

insert into DauSach values ('S01', 'Than Dong Dat Viet', 'nxb01')
insert into DauSach values ('S02', 'Tay Du Ky', 'nxb02')
insert into DauSach values ('S03', 'Doraemon', 'nxb03')
insert into DauSach values ('S04', 'Mouri Tham tu lung danh', 'nxb02')
insert into DauSach values ('S05', 'Bay vien ngoc rong', 'nxb03')
insert into DauSach values ('S06', 'Trinh Tham', 'nxb04')
insert into DauSach values ('S07', 'Suc khoe va Thoi gian', 'nxb05')
insert into DauSach values ('S08', 'Nobita va Son Goku', 'nxb04')
insert into DauSach values ('S09', 'Cach lam giau nhanh nhat', 'nxb03')
insert into DauSach values ('S10', 'Chien tranh va hoa binh', 'nxb01')
go

insert into CuonSach values ('S01','C01','001')
insert into CuonSach values ('S01','C02','023')
insert into CuonSach values ('S02','C03','004')
insert into CuonSach values ('S02','C04','008')
insert into CuonSach values ('S03','C05','012')
insert into CuonSach values ('S03','C06','092')
insert into CuonSach values ('S04','C07','006')
insert into CuonSach values ('S04','C08','007')
insert into CuonSach values ('S05','C09','009')
insert into CuonSach values ('S05','C10','010')
insert into CuonSach values ('S06','C11','011')
insert into CuonSach values ('S06','C12','024')
insert into CuonSach values ('S07','C13','034')
insert into CuonSach values ('S07','C14','025')
insert into CuonSach values ('S08','C15','099')
insert into CuonSach values ('S08','C16','093')
insert into CuonSach values ('S09','C17','021')
insert into CuonSach values ('S09','C18','102')
insert into CuonSach values ('S10','C19','203')
insert into CuonSach values ('S10','C20','402')
go

insert into TacGia values ('S01','Hemingway')
insert into TacGia values ('S01','Van Trung')
insert into TacGia values ('S02','Nguyen Nhat Anh')
insert into TacGia values ('S03','Johny Hawk')
insert into TacGia values ('S03','Hemingway')
insert into TacGia values ('S04','Jackey Love')
insert into TacGia values ('S05','Kein Forgein')
insert into TacGia values ('S09','Hemingway')
go

insert into NXB values ('nxb01','Kim Dong','TPHCM','0123456789')
insert into NXB values ('nxb02','Phuong Nam','Ha Noi','0133456789')
insert into NXB values ('nxb03','Addison Wesley','USA','0143456789')
insert into NXB values ('nxb04','Vina Books','TPHCM','0153456789')
insert into NXB values ('nxb05','Nguyen Tri Phuong','Da Nang','0163456789')
insert into NXB values ('nxb06','Tho bay mau','Ha Noi','0173456789')
go

alter table Docgia
	alter column tenDG varchar(50) null
go

insert into DocGia values ('DG01', 'Phan Thanh Trung', 'Da Lat','0183456789')
insert into DocGia values ('DG02', 'Tran Van Tri', 'Sai Gon','0193456789')
insert into DocGia values ('DG03', 'Mai Thu Khoa', 'TPHCM','0184456789')
insert into DocGia values ('DG04', 'Nguyen Van A', 'Thu Duc','0185456789')
insert into DocGia values ('DG05', 'Nguyen Hung Anh', 'TPHCM','0186456789')
insert into DocGia values ('DG06', 'Cao Hoai Nhi', 'Da Lat','0187456789')
go

insert into Muon values ('C01','DG01','1998-12-29','1999-01-15')
insert into Muon values ('C03','DG01','1998-12-25','1999-01-10')
insert into Muon values ('C05','DG02','2000-05-26','2000-06-14')
insert into Muon values ('C17','DG03','1999-08-23','1999-10-17')
insert into Muon values ('C01','DG04','2001-01-3','2001-01-6')
insert into Muon values ('C01','DG05','1999-06-13','1999-03-16')
insert into Muon values ('C19','DG04','1998-04-29','1998-11-20')
go

-- Bài 3
create database NhanVienCoQuan
go

use NhanVienCoQuan
go

create table CoQuan(
	MSCoQuan char(2) primary key,
	TenCoQuan varchar(50) null,
	DiaChi varchar(50) null
)
go

create table NV(
	MSNV char(4) primary key,
	ten varchar(50) null,
	MSCoQuan char(2) references CoQuan(MSCoQuan),
	CongViec char(50) null,
	Luong real
)
go

insert into CoQuan values ('15','Ky thuat','TPHCM')
insert into CoQuan values ('12','Kinh doanh','Da Nang')
insert into CoQuan values ('25','San xuat','Ha Noi')
insert into CoQuan values ('20','Ke toan','Do Son')
insert into CoQuan values ('26','Hanh chinh van phong','Da Lat')
insert into CoQuan values ('32','Marketing','Do Son')
insert into CoQuan values ('50','Tong giam doc','Do Son')
go

insert into NV values ('nv01','Trung','15','Lap trinh',25000000)
insert into NV values ('nv02','Tri','12','Ban hang',23000000)
insert into NV values ('nv03','Tai','20','Thong ke',19000000)
insert into NV values ('nv04','Khoa','32','Quang cao',35000000)
insert into NV values ('nv05','Trong','25','Dong goi',72000000)
insert into NV values ('nv06','Giao','15','Phan tich',27000000)
insert into NV values ('nv07','Hung','50','Giam doc',100700000)
insert into NV values ('nv08','Dung','50','Pho giam doc',84000000)
go

-- Bài 4
create database Gara
go

use Gara
go

create table Tho(
	MaTho char(3) primary key,
	Tentho varchar(50),
	Nhom int,
	Nhomtruong char(3) references Tho(MaTho)
)
go

create table Congviec(
	MaCv char(4) primary key,
	NoidungCV varchar(50)
)
go

create table KhachHang(
	MaKH char(4) primary key,
	tenKH varchar(50),
	DiaChi varchar(50),
	DienThoai char(10)
)
go

create table HopDong(
	SoHD int primary key,
	NgayHD date,
	MaKH char(4) references KhachHang (maKH),
	SoXe int,
	TriGiaHD real,
	NgayGiaoDK date,
	NgayNgThu date
)
go

create table ChiTietHD(
	SoHD int references Hopdong(soHD),
	macv char(4) references Congviec(macv),
	TriGiaCV real,
	matho char(3) references Tho(matho),
	Khoantho real,
	primary key(soHD, maCV)
)
go

create table PhieuThu(
	SoPT int primary key,
	NgaylapPT date,
	SoHD int references Hopdong(sohd),
	makh char(4) references khachhang(makh),
	hoten char(50),
	sotienthu real
)
go

insert into Tho values ('t01','Trung',1,'t01')
insert into Tho values ('t02','Trong',2,'t05')
insert into Tho values ('t03','Tai',1,'t01')
insert into Tho values ('t04','Khoa',1,'t01')
insert into Tho values ('t05','Hieu',2,'t05')
insert into Tho values ('t06','Anh',3,'t06')
insert into Tho values ('t07','Dung',3,'t06')
go

insert into Congviec values ('cv01','Rua xe')
insert into Congviec values ('cv02','Thay nhot')
insert into Congviec values ('cv03','Va banh xe')
insert into Congviec values ('cv04','Bom banh xe')
insert into Congviec values ('cv05','Thay phu tung')
go

insert into HopDong values (1,'2002-03-15','kh01',2,6300000,'2002-03-26','2002-04-03')
insert into HopDong values (2,'2003-04-11','kh01',4,10300000,'2003-05-04','2003-05-13')
insert into HopDong values (3,'2002-12-07','kh02',7,2400000,'2002-03-26','2002-04-03')
insert into HopDong values (4,'2001-08-05','kh03',9,1800000,'2001-10-02','2001-09-30')
insert into HopDong values (5,'2002-09-04','kh04',3,4800000,'2002-11-22',null)
insert into HopDong values (6,'2003-11-12','kh03',1,2900000,'2003-12-17',null)
go

insert into KhachHang values ('kh01','Truong','Go Vap','0123456789')
insert into KhachHang values ('kh02','Trung','Da Lat','0124456789')
insert into KhachHang values ('kh03','Han','Da Nang','0125456789')
insert into KhachHang values ('kh04','Ngan','Thu Duc','0126456789')
insert into KhachHang values ('kh05','Phuong','TP. HCM','0127456789')
insert into KhachHang values ('kh06','Quoc','Lao Cai','0128456789')
insert into KhachHang values ('kh07','Kha','Kien Giang','0129456789')
go

insert into ChiTietHD values (1,'cv01',3500000,'t01',2000000)
insert into ChiTietHD values (1,'cv02',2800000,'t02',1500000)
insert into ChiTietHD values (2,'cv03',4200000,'t01',3100000)
insert into ChiTietHD values (3,'cv04',2400000,'t03',1200000)
insert into ChiTietHD values (5,'cv01',4800000,'t05',3700000)
insert into ChiTietHD values (2,'cv05',6100000,'t04',4900000)
insert into ChiTietHD values (4,'cv02',1800000,'t07',980000)
insert into ChiTietHD values (2,'cv04',2300000,'t04',1100000)
insert into ChiTietHD values (6,'cv03',2900000,'t03',1780000)
go


insert into PhieuThu values (1,'2002-12-03',1,'kh01','Nhung',2800000)
insert into PhieuThu values (2,'2002-04-18',1,'kh01','Truong',3500000)
insert into PhieuThu values (3,'2002-07-22',2,'kh01','Truong',1200000)
insert into PhieuThu values (4,'2002-09-20',3,'kh02','Trong',2000000)
insert into PhieuThu values (5,'2001-11-07',5,'kh04','Hoa',4800000)
insert into PhieuThu values (6,'2003-02-28',4,'kh03','Han',1800000)
insert into PhieuThu values (7,'2003-08-29',6,'kh03','Han',2900000)
go

-- Bài 5
create database TruongPt
go

use TruongPT
go

create table MHoc(
	MaMH char(4) primary key,
	tenMH varchar(50),
	sotiet int
)
go

create table GV(
	maGV char(4) primary key,
	tenGV varchar(50),
	maMH char(4) references Mhoc(mamh),
)
go

create table BuoiThi(
	Hky int,
	ngay date,
	gio varchar(20),
	phg int,
	MaMH char(4) references Mhoc(mamh),
	TgThi int,
	primary key(hky, ngay, gio, phg)
)
go

create table PCcoiThi(
	maGV char(4) references GV(maGV),
	hk int,
	ngay date,
	gio varchar(20),
	phg int
	primary key(magv, hk, ngay, gio, phg),
	foreign key(hk, ngay, gio, phg) references buoithi(hky, ngay, gio, phg)
)
go

insert into MHoc values ('mh01','Toan hoc',52)
insert into MHoc values ('mh02','Van hoc',54)
insert into MHoc values ('mh03','Vat ly',38)
insert into MHoc values ('mh04','Hoa hoc',35)
go

insert into GV values('gv01','Trang','mh01')
insert into GV values('gv02','Tai','mh01')
insert into GV values('gv03','Hoa','mh02')
insert into GV values('gv04','Linh','mh03')
insert into GV values('gv05','Van','mh02')
insert into GV values('gv06','Hoang','mh04')
insert into GV values('gv07','Minh','mh04')
insert into GV values('gv08','Hanh','mh03')
insert into GV values('gv09','Tri','mh04')
go

insert into BuoiThi values (1,'2002-12-09','7h00',12,'mh01',150)
insert into BuoiThi values (1,'2002-12-09','10h00',12,'mh04',120)
insert into BuoiThi values (1,'2002-12-11','16h30',25,'mh03',120)
insert into BuoiThi values (1,'2002-12-13','15h15',31,'mh02',150)
insert into BuoiThi values (2,'2003-05-28','14h30',5,'mh01',150)
insert into BuoiThi values (2,'2003-05-30','17h15',10,'mh02',150)
insert into BuoiThi values (2,'2003-06-01','7h00',19,'mh03',120)
insert into BuoiThi values (2,'2003-06-03','8h30',23,'mh04',120)
go

insert into PCcoiThi values ('gv03',1,'2002-12-09','7h00',12)
insert into PCcoiThi values ('gv01',1,'2002-12-09','10h00',12)
insert into PCcoiThi values ('gv02',1,'2002-12-11','16h30',25)
insert into PCcoiThi values ('gv04',1,'2002-12-13','15h15',31)
insert into PCcoiThi values ('gv05',2,'2003-05-28','14h30',5)
insert into PCcoiThi values ('gv08',2,'2003-05-30','17h15',10)
insert into PCcoiThi values ('gv07',2,'2003-06-01','7h00',19)
insert into PCcoiThi values ('gv01',2,'2003-06-03','8h30',23)
go