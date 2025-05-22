using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuanLyCuaHangTienLoi
{
    internal class HoaDonDAO
    {
        DBConnection db = new DBConnection(Program.nv);
        public DataTable LayDanhSach()
        {
            string sql = "Select * from HoaDon";
            return db.LayDanhSach(sql);
        }
        public DataTable LayDanhSachTheoKhachHang(int sdtkh)
        {
            string sql = $"Select * from HoaDon Where SDTKH = {sdtkh}";
            return db.LayDanhSach(sql);
        }
       
        public void ThanhToan()
        {
            string sql = $"EXECUTE dbo.UpdateLaiCuaHangKhiThanhToan";
            db.Execute(sql);
        }
        public void HuyThanhToan(int mahd)
        {
            string sql = $"EXECUTE dbo.sp_XoaHoaDon @mahd = {mahd}";
            db.Execute(sql);
        }
        public void TaoHD()
        {
            string sql = "EXEC dbo.sp_ThemHoaDon @manv = NULL,  @sdtkh = NULL, @pttt = NULL";
            db.Execute(sql);
        }
        public int MaxHD()
        {
            string query = String.Format("SELECT dbo.MaxHD()");
            return Convert.ToInt32(db.LayGiaTri(query));
        }
        public void TaoHD(HoaDon hd)
        {
            string query = String.Format($"EXEC dbo.sp_ThemHoaDon @manv = N'{hd.MaNV}'," +
                                                                $"@sdtkh = {hd.SdtKH}," +
                                                                $"@pttt = N'{hd.PTTT}'");

            db.Execute(query);
        }
        public string TinhDoanhThu()
        {
            string sql = "SELECT dbo.TinhDoanhThu()";
            return db.LayGiaTri(sql);
        }

        public DataTable LocDoanhThu(DateTime Tu, DateTime Den)
        {
            string sql = $"Select * From dbo.LocDoanhThu('{Tu.ToString("yyyy-MM-dd")}', '{Den.ToString("yyyy-MM-dd")}')";
            return db.LayDanhSach(sql);
        }
    }
}
