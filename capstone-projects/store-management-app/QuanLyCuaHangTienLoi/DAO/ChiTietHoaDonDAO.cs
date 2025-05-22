using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuanLyCuaHangTienLoi
{
    internal class ChiTietHoaDonDAO
    {
        DBConnection db = new DBConnection(Program.nv);

        public DataTable LayDanhSach()
        {
            string sql = "Select * from ChiTietHoaDon";
            return db.LayDanhSach(sql);
        }
        public DataTable LayDanhSachTheoHoaDon(int mahd)
        {
            string sql = $"Select * from ChiTietHoaDon Where mahd = {mahd}";
            return db.LayDanhSach(sql);
        }
        public DataTable LayDanhSachThanhToan()
        {
            string sql = "Select * from ChiTietHoaDonThanhToan";
            return db.LayDanhSach(sql);
        }

        public void Order(ChiTietHoaDon cthd)
        {
            string query = String.Format($"EXEC dbo.sp_ThemChiTietHoaDon @mahd = N'{cthd.MaHD}'," +
                                                                $"@masp= N'{cthd.MaSP}'," +
                                                                $"@nsx = N'{cthd.NSX.ToString("yyyy-MM-dd")}'," +
                                                                $"@hsd = N'{cthd.HSD.ToString("yyyy-MM-dd")}'," +
                                                                $"@sl = N'{cthd.SoLuong}'");
            db.Execute(query);
            
        }
        public DataTable LayDanhSachThanhToanRong()
        {
            string sql = "Select * from ChiTietHoaDonThanhToan Where 0=1";
            return db.LayDanhSach(sql);
        }
    }
}
