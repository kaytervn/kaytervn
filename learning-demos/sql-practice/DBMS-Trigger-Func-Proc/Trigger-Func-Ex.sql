CREATE PROCEDURE sp_TinhTongHaiSoNguyen
    @num1 INT,
    @num2 INT
AS
BEGIN
    DECLARE @sum INT;
    SET @sum = @num1 + @num2;
    SELECT @sum AS 'Sum';
END

CREATE PROC sp_ThongTinDauSach @ISBN NVARCHAR(10)
AS
BEGIN
	SELECT * FROM
END

Inline Table-Valued Functions:
CREATE FUNCTION KetQuaBang()
RETURNS TABLE
AS
RETURN (SELECT NHANVIEN.MANV, NHANVIEN.HONV,
NHANVIEN.TENLOT, NHANVIEN.TENNV,
NHANVIEN.NGSINH, THANNHAN.TENTN, NHANVIEN.LUONG
FROM NHANVIEN, THANNHAN
WHERE NHANVIEN.MANV=THANNHAN.MA_NVIEN)
Multistatement Table-Valued:
CREATE FUNCTION KetQuaBang()
RETURNS @table table(MANV varchar(9), HONV nvarchar(15), TENLOT
nvarchar(30), TENNV nvarchar(30), NGSINH smalldatetime,
TENTN varchar(20), LUONGTB numeric(18,0))
AS
BEGIN
INSERT @table SELECT NHANVIEN.MANV, NHANVIEN.HONV,
NHANVIEN.TENLOT, NHANVIEN.TENNV,
NHANVIEN.NGSINH, THANNHAN.TENTN,
NHANVIEN.LUONGFROM NHANVIEN, THANNHAN
WHERE NHANVIEN.MANV=THANNHAN.MA_NVIEN
RETURN
END


CREATE PROC sp_ThongtinNguoilonQuahan
AS
BEGIN
    SELECT DocGia.ma_DocGia, ho, tenlot, ten, ngaysinh, sonha, duong, quan, dienthoai, han_sd
	FROM dbo.DocGia, dbo.Nguoilon, dbo.QuaTrinhMuon
	WHERE DocGia.ma_DocGia = Nguoilon.ma_DocGia AND Nguoilon.ma_DocGia = QuaTrinhMuon.ma_DocGia AND DATEDIFF(DAY, ngay_hethan, GETDATE()) >= 14
END
GO

CREATE TRIGGER tg_updCuonSach
ON dbo.CuonSach
AFTER UPDATE
DECLARE @trangthai
SELECT TrangThai FROM 
AS
BEGIN
	 = SELECT FROM CuonSach
	ưhere
END
GO

CREATE TRIGGER tg_updCuonSach ON Cuonsach
AFTER UPDATE
AS
BEGIN
	DECLARE @tinhtrang VARCHAR(10), @isbn VARCHAR(10)
	SELECT @tinhtrang = tinhtrang, @isbn = isbn FROM inserted
	UPDATE DausachSET trangthai = @tinhtrang AND isbn = @isbn
END

SELECT RIGHT('00000000' + CAST(FLOOR(RAND() * POWER(10, 6)) AS VARCHAR(8)), 8)