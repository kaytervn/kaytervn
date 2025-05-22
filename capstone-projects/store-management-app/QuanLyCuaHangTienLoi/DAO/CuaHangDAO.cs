using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuanLyCuaHangTienLoi
{
    internal class CuaHangDAO
    {
        DBConnection db = new DBConnection(Program.nv);
        public DataTable LayDanhSach()
        {
            string sql = "select * from viewcuahang";
            return db.LayDanhSach(sql);
        }

        public DataTable LayDanhSach_ConHan()
        {
            string sql = "select * from viewcuahang WHERE HSD >= GetDATE()";
            return db.LayDanhSach(sql);
        }

        public DataTable LayDanhSach_HetHan()
        {
            string sql = "select * from viewcuahang WHERE HSD < GetDATE()";
            return db.LayDanhSach(sql);
        }

        public void XuatKho(CuaHang ch)
        {

            string query = String.Format($"EXEC dbo.sp_XuatKho @masp = N'{ch.MaSP}'," +
                                                                $"@nsx = N'{ch.NSX.ToString("yyyy-MM-dd")}'," +
                                                                $"@hsd = N'{ch.HSD.ToString("yyyy-MM-dd")}'," +
                                                                $"@ngayxuatkho = N'{ch.NgayXuatKho.ToString("yyyy-MM-dd")}'," +
                                                                $"@soluong = N'{ch.SoLuong}'");

            db.Execute(query);
        }
        public void TraKho(CuaHang ch)
        {

            string query = String.Format($"EXEC dbo.sp_TraKho @masp = N'{ch.MaSP}'," +
                                                                $"@nsx = N'{ch.NSX.ToString("yyyy-MM-dd")}'," +
                                                                $"@hsd = N'{ch.HSD.ToString("yyyy-MM-dd")}'," +
                                                                $"@ngayxuatkho = N'{ch.NgayXuatKho.ToString("yyyy-MM-dd")}'," +
                                                                $"@soluong = N'{ch.SoLuong}'");

            db.Execute(query);
        }

        public DataTable TimKiem(string find)
        {
            string query = string.Format($"SELECT * FROM dbo.f_TimKiemCuaHang(N'{find}')");
            return db.LayDanhSach(query);
        }

        public DataTable TimKiem_ConHan(string find)
        {
            string query = string.Format($"SELECT * FROM dbo.f_TimKiemCuaHang(N'{find}') WHERE HSD >= GetDATE()");
            return db.LayDanhSach(query);
        }

        public DataTable TimKiem_HetHan(string find)
        {
            string query = string.Format($"SELECT * FROM dbo.f_TimKiemCuaHang(N'{find}') WHERE HSD < GetDATE()");
            return db.LayDanhSach(query);
        }
    }
}
