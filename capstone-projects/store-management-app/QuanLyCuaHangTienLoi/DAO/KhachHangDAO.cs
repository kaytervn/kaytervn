using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuanLyCuaHangTienLoi
{
    internal class KhachHangDAO
    {
        DBConnection db = new DBConnection(Program.nv);
        public DataTable LayDanhSach()
        {
            string sql = "Select * from KhachHang";
            return db.LayDanhSach(sql);
        }

        public void Them(KhachHang kh)
        {
            string query = String.Format($"EXEC dbo.sp_ThemKhachHang @sdt = N'{kh.Sdt}'," +
                                                                $"@tenkh = N'{kh.TenKH}'," +
                                                                $"@diemtichluy = N'{kh.DiemTichLuy}'");
                                                               
            db.Execute(query);
        }

        public void Sua(KhachHang kh)
        {
            string query = String.Format($"EXEC dbo.sp_SuaKhachHang @sdt = N'{kh.Sdt}'," +
                                                                $"@tenkh = N'{kh.TenKH}'," +
                                                                $"@diemtichluy = N'{kh.DiemTichLuy}'");
            db.Execute(query);
        }

        public void Xoa(KhachHang kh)
        {
            string query = String.Format($"EXEC dbo.sp_XoaKhachHang @sdt = N'{kh.Sdt}'");
            db.Execute(query);
        }

        public DataTable TimKiem(string find)
        {
            string query = string.Format($"SELECT * FROM dbo.f_TimKiemKhachHang(N'{find}')");
            return db.LayDanhSach(query);
        }
    }
}
