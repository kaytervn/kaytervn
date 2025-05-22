-- Người thực hiện: Kiến Đức Trọng. MSSV: 21110332
-- Em cam đoạn tất cả các câu dưới đây đều do em viết code và đều đã chạy ra kết quả

-- Bài 1
use QLNV
go

-- 1.1 Hãy cho biết tên các dự án mà nhân viên có mã ‘NV01’ tham gia
select tenDA
from DUAN inner join (select * from PhanCong where MaNV='NV01') Q on DUAN.MaDA = Q.MaDA

-- 1.2 Tính tổng thời gian tham gia các dự án của mỗi nhân viên
select MaNV, sum(ThoiGian) as TongTG
from PhanCong
group by MaNV

-- 1.3 Cho biết họ tên các nhân viên chưa tham gia dự án nào
select honv, tenlot, tennv
from NhanVien left outer join PhanCong on NhanVien.Manv = PhanCong.MaNV
where PhanCong.MaNV is null

-- 1.a Tìm ngày sinh và địa chỉ của nhân viên “Nguyễn Bảo Hùng”
select Ngsinh, Dchi
from NhanVien
where HoNV = 'Nguyen' and Tenlot = 'Bao' and tenNV = 'Hung'

-- 1.b Tìm tên và địa chỉ của các nhân viên làm việc cho phòng “Nghiên cứu”
select tenNV, Dchi
from NhanVien, PhongBan
where NhanVien.Phong = PhongBan.MaPB and TenPB = 'Nghien cuu'

-- 1.c Với mỗi dự án được triển khai ở Gò Vấp, cho biết mã dự án, mã phòng quản lý và họ tên, ngày sinh trưởng phòng của phòng đó
select MaDA, DUAN.Phong, HoNV, Tenlot, tenNV, NgSinh, TrPhong
from DUAN, PhongBan, NhanVien
where DUAN.Phong = PhongBan.MaPB and PhongBan.TrPhong = NhanVien.Manv and DUAN.DiaDiem = 'Go Vap'

-- 1.d Với mỗi nhân viên, cho biết họ tên nhân viên và họ tên của người quản lý nhân viên đó
select nv.HoNV, nv.Tenlot, nv.tenNV, ql.HoNV HoNQL, ql.Tenlot TenlotNQL, ql.tenNV tenNQL
from NhanVien nv join NhanVien ql on nv.Manv = ql.MaNQL

-- 1.e Cho biết mã nhân viên, họ và tên của các nhân viên của phòng “Nghiên cứu” có mức lương từ 30000 đến 50000
select manv, honv, tenlot, tennv
from (select * 
	from PhongBan 
	where TenPB = 'Nghien cuu') Q1 join (select *
										from NhanVien 
										where Luong between 30000 and 50000 ) Q2 on Q1.MaPB = Q2.Phong

-- 1.f Cho biết mã nhân viên, họ tên nhân viên và mã dự án, tên dự án của các dự án mà họ tham gia
select nhanvien.manv, honv, tennv, duan.mada, TenDA
from DUAN, PhanCong, NhanVien
where DUAN.MaDA = PhanCong.MaDA and PhanCong.MaNV = NhanVien.Manv

-- 1.g Cho biết mã nhân viên, họ tên của những người không có người quản lý
select manv, honv, tenlot, tennv
from NhanVien
where MaNQL is null

-- 1.h Cho biết họ tên của các trưởng phòng có thân nhân
select distinct HoNV, Tenlot, tenNV
from PhongBan, ThanNhan, NhanVien
where PhongBan.TrPhong = ThanNhan.MaNV and ThanNhan.MaNV = NhanVien.manv

-- 1.i Tính tổng lương nhân viên, lương cao nhất, lương thấp nhất và mức lương trung bình 
select sum(Luong) TongLuong, max(Luong) LuongCaoNhat, min(luong) LuongThapNhat, AVG(luong) LuongTB
from NhanVien

-- 1.j Cho biết tổng số nhân viên và mức lương trung bình của phòng “Nghiên cứu”
select count(manv) as TongNV, avg(luong) as LuongTB
from NhanVien, PhongBan
where NhanVien.Phong = PhongBan.MaPB and TenPB = 'Nghien cuu'

-- 1.k Với mỗi phòng, cho biết mã phòng, số lượng nhân viên và mức lương trung bình
select Phong, COUNT(manv) as SLNV, avg(luong) LuongTB
from NhanVien
group by Phong

-- 1.l Với mỗi dự án, cho biết mã dự án, tên dự án và tổng số nhân viên tham gia
select DUAN.MaDA, TenDA, count(manv) as TongNV
from DUAN, PhanCong
where DUAN.MaDA = PhanCong.MaDA
group by DUAN.MaDA, TenDA

-- 1.m Với mỗi dự án có nhiều hơn 2 nhân viên tham gia, cho biết mã dự án, tên dự án và số lượng nhân viên tham gia 
select duan.MaDA, TenDA, count(manv) as SLNV
from DUAN, PhanCong
where duan.MaDA = PhanCong.MaDA
group by duan.MaDA, TenDA
having COUNT(manv) > 2

-- 1.n Với mỗi dự án, cho biết mã số dự án, tên dự án và số lượng nhân viên phòng số 5 tham gia
select duan.MaDA, TenDA, count(PhanCong.manv) as SLNVP5
from DUAN, PhanCong, NhanVien
where DUAN.MaDA = PhanCong.MaDA and PhanCong.MaNV = NhanVien.MaNv and Nhanvien.Phong = 5
group by DUAN.MaDA, TenDA

-- 1.o Với mỗi phòng có nhiều hơn 2 nhân viên, cho biết mã phòng và số lượng nhân viên có lương lớn hơn 25000
select Phong, count(manv) as SLNV
from NhanVien
where Luong > 25000
group by Phong
having count(manv) > 2

-- 1.p Với mỗi phòng có mức lương trung bình lớn hơn 30000, cho biết mã phòng, tên phòng, số lượng nhân viên của phòng đó 
select MaPB, TenPB, count(manv) SLNV
from NhanVien, PhongBan
where NhanVien.Phong = PhongBan.MaPB
group by MaPB, TenPB
having avg(luong) > 30000

-- 1.q Với mỗi phòng có mức lương trung bình lớn hơn 30000, cho biết mã phòng, tên phòng, số lượng nhân viên nam của phòng đó 
select MaPB, TenPB, count(manv) SLNVnam
from NhanVien, PhongBan
where NhanVien.Phong = PhongBan.MaPB and Phai = 'Nam'
group by MaPB, TenPB
having avg(luong) > 30000

-- Bài 2
use ThuVien
go

-- 2.a Cho biết Địa chỉ và số điện thoại của Nhà xuất bản “Addison Wesley”
select DiaChi, SoDT
from NXB
where TenNXB = 'Addison Wesley'

-- 2.b Cho biết mã sách và Tựa sách của những cuốn sách được xuất bản bởi nhà xuất bản “Addison Wesley”
select masach, tua
from DauSach, nxb
where dausach.MaNXB = nxb.MaNXB and TenNXB = 'Addison Wesley'

-- 2.c Cho biết mã sách và Tựa sách của những cuốn sách có tác giả là “Hemingway”
select dausach.MaSach, tua
from dausach, TacGia
where dausach.MaSach = TacGia.MaSach and TenTG = 'hemingway'

-- 2.d Với mỗi đầu sách, cho biết tựa và số lượng cuốn sách mà thư viện đang sở hữu 
select tua, COUNT(macuon) as SoLuong
from DauSach join CuonSach on DauSach.MaSach = CuonSach.Masach
group by dausach.Masach, tua

-- 2.e Với mỗi độc giả, hãy cho biết Tên, địa chỉ và số lượng cuốn sách mà người đó đã mượn
select tendg, diachi, count(macuon) as soluong
from docgia join muon on DocGia.MaDG = muon.MaDG
group by TenDG, DiaChi

-- 2.f Cho biết mã cuốn, tựa sách và vị trí của những cuốn sách được xuất bản bởi nhà xuất bản “Addison Wesley”
select macuon, tua, vitri
from nxb, dausach, CuonSach
where nxb.MaNXB = DauSach.MaNXB and dausach.MaSach = CuonSach.Masach
		and TenNXB = 'Addison Wesley'

-- 2.g Với mỗi đầu sách, hãy cho biết Tên nhà xuất bản và số lượng tác giả
select tennxb, count(tentg) as SLTG
from TacGia, DauSach, NXB
where TacGia.MaSach = DauSach.MaSach and DauSach.MaNXB = NXB.MaNXB
group by TenNXB

-- 2.h Hãy cho biết Tên, địa chỉ, số điện thoại của những độc giả đã mượn từ 5 cuốn sách trở lên
select tendg, diachi, sodt, count(macuon) SLSachMuon
from muon, DocGia
where muon.MaDG = DocGia.MaDG
group by TenDG, DiaChi, SoDT
having count(macuon) >=5

-- 2.i Cho biết mã NXB, tên NXB và số lượng đầu sách của NXB đó trong CSDL
select nxb.manxb, tennxb, count(masach) SLDauSach
from nxb join DauSach on nxb.MaNXB = DauSach.MaNXB
group by nxb.MaNXB, TenNXB

-- 2.j Cho biết mã NXB, tên NXB và địa chỉ của những NXB có từ 100 đầu sách trở lên 
select nxb.MaNXB, TenNXB, DiaChi, count(masach) SLDauSach
from DauSach join NXB on DauSach.MaNXB = NXB.MaNXB
group by nxb.MaNXB, TenNXB, DiaChi
having count(masach) >=100

-- 2.k Cho biết mã NXB, tên NXB, và số lượng tác giả đã hợp tác với NXB đó 
select nxb.MaNXB, tenNXB, count(tentg) sltg
from nxb join (
		select distinct manxb, tentg
		from TacGia join DauSach on tacgia.MaSach = DauSach.MaSach
	) Q on nxb.MaNXB = Q.MaNXB
group by nxb.MaNXB, tenNXB

-- 2.l Tựa và số lượng tác giả của những cuốn sách có tác giả là “Hemingway” mà độc giả “Nguyễn Văn A” đã từng mượn
select tua, sltg
from dausach,
(
	select tacgia.masach, count(tentg) SLTG
	from TacGia join (
			select distinct masach
			from TacGia
			where TenTG = 'Hemingway'
		) Q on TacGia.MaSach = Q.MaSach
	group by tacgia.MaSach
) Q1,
(
	select distinct masach
	from CuonSach, Muon, DocGia
	where CuonSach.MaCuon = Muon.MaCuon and Muon.MaDG = DocGia.MaDG
		and TenDG = 'Nguyen Van A'
) Q2
where DauSach.MaSach = Q1.masach and Q1.Masach = Q2.Masach

-- Bài 3
use NhanVienCoQuan
go

-- 3.a Tìm tên những nhân viên ở cơ quan có mã số là 50
select ten
from nv
where mscoquan = '50'

-- 3.b Tìm mã số tất cả các cơ quan từ quan hệ NV
select distinct mscoquan
from nv

-- 3.c Tìm tên các nhân viên ở cơ quan có mã số là 15, 20, 25
select ten
from nv
where MSCoQuan = '20' or MSCoQuan = '15' or MSCoQuan = '25'

-- 3.d Tìm tên những người làm việc ở Đồ Sơn
select ten
from CoQuan join nv on CoQuan.MSCoQuan = nv.MSCoQuan
where DiaChi = 'Do Son'

-- Bài 4
use Gara
go

-- 4.1 Cho biết danh sách các người thợ hiện không tham gia vào một  hợp đồng sửa chữa nào.
select tho.MaTho, Tentho
from tho join (
	(select matho
	from Tho) except
					(select matho
					from ChiTietHD)
) Q on tho.MaTho = Q.MaTho

-- 4.2 Cho biết danh sách những hợp đồng đã thanh lý nhưng chưa được thanh toán tiền đầy đủ.
select hopdong.SoHD
from PhieuThu join HopDong on PhieuThu.SoHD = HopDong.SoHD
where NgayNgThu is not null
group by hopdong.SoHD, TriGiaHD
having sum(sotienthu) < TriGiaHD

-- 4.3 Cho biết danh sách những hợp đồng cần phải hoàn tất trước ngày 31/12/2002
select *
from HopDong
where NgayGiaoDK < '2002-12-31'

-- 4.4 Cho biết người thợ nào thực hiện công việc nhiều nhất.
select tho.matho, Tentho
from ChiTietHD join Tho on ChiTietHD.matho = tho.MaTho
group by tho.MaTho, Tentho
having count(macv) in (
	select max(slcv) as CVmax
	from (
			select count(macv) SLCV
			from ChiTietHD
			group by matho
		) Q
)

-- 4.5 Cho biết người thợ nào có tổng trị giá công việc được giao cao nhất
select tho.MaTho, TenTho
from ChiTietHD join Tho on ChiTietHD.matho = tho.MaTho
group by tho.MaTho, Tentho
having sum(TriGiaCV) in (
	select max(tongTGCV) as TGmax
	from (
			select sum(trigiacv) TongTGCV
			from ChiTietHD
			group by matho
		) Q
)

-- Bài 5
use TruongPT
go

-- 5.3.a Danh sách các giáo viên dạy các môn học có số tiết từ 45 trở lên
select magv, tengv
from GV join mhoc on GV.mamh = mhoc.mamh
where sotiet >= 45

-- 5.3.b Danh sách giáo viên được phân công gác thi trong học kỳ 1
select gv.magv, tengv
from gv join pccoithi on gv.magv = pccoithi.magv
where hk = 1

-- 5.3.c Danh sách giáo viên không được phân công gác thi trong học kỳ 1
select gv.magv, tengv
from gv join (
	(select magv
	from gv) except(select magv
				from pccoithi
				where hk = 1)
) Q on gv.magv = Q.magv

-- 5.3.d Cho biết lịch thi môn văn (TENMH = ‘VĂN HỌC’)
select *
from buoithi 
where mamh in(
	select mamh
	from mhoc
	where tenmh = 'Van hoc'
)

-- 5.3.e Cho biết các buổi gác thi của các giáo viên chủ nhiệm môn văn (TENMH = ‘VĂN HỌC’).
select *
from pccoithi
where magv in(
	select magv
	from GV 
	where mamh in(
		select mamh
		from mhoc
		where tenmh = 'Van hoc'
	)
)