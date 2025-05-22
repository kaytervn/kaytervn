using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuanLyCuaHangTienLoi.DAO
{
    internal class KhoDAO
    {
        DBConnection db = new DBConnection(Program.nv);
        public DataTable LayDanhSach()
        {
            string sql = "Select * from ViewKho";
            return db.LayDanhSach(sql);
        }

        public DataTable LayDanhSach_ConHan()
        {
            string sql = "select * from ViewKho WHERE HSD >= GetDATE()";
            return db.LayDanhSach(sql);
        }

        public DataTable LayDanhSach_HetHan()
        {
            string sql = "select * from ViewKho WHERE HSD < GetDATE()";
            return db.LayDanhSach(sql);
        }

        public void NhapKho(Kho k)
        {
            string query = String.Format(
                                            $"EXEC dbo.sp_NhapKho @masp = N'{k.MaSP}'," +
                                            $"@nsx = N'{k.NSX.ToString("yyyy-MM-dd")}'," +
                                            $"@hsd = N'{k.HSD.ToString("yyyy-MM-dd")}'," +
                                            $"@ngaynhapkho = N'{k.NgayNhapKho.ToString("yyyy-MM-dd")}'," +
                                            $"@loaikho = N'{k.LoaiKho}'," +
                                            $"@sltonkho = N'{k.SLTonKho}'"
            );

            db.Execute(query);
        }

        public void Sua(Kho k)
        {

            string query = String.Format($"EXEC dbo.sp_SuaSPvaoKho @masp = N'{k.MaSP}'," +
                                                                $"@nsx = N'{k.NSX.ToString("yyyy-MM-dd")}'," +
                                                                $"@hsd = N'{k.HSD.ToString("yyyy-MM-dd")}'," +
                                                                $"@ngaynhapkho = N'{k.NgayNhapKho.ToString("yyyy-MM-dd")}'," +
                                                                $"@loaikho = N'{k.LoaiKho}'," +
                                                                $"@sltonkho = N'{k.SLTonKho}'");

            db.Execute(query);
        }

        public void Xoa(Kho k)
        {
            string query = String.Format($"EXEC dbo.sp_XoaSPvaoKho @masp = N'{k.MaSP}'," +
                                                                $"@nsx = N'{k.NSX.ToString("yyyy-MM-dd")}'," +
                                                                $"@hsd = N'{k.HSD}'");

            db.Execute(query);
        }

        public DataTable TimKiem(string find)
        {
            string query = string.Format($"SELECT * FROM dbo.f_TimKiemKho(N'{find}')");
            return db.LayDanhSach(query);
        }

        public DataTable TimKiem_ConHan(string find)
        {
            string query = string.Format($"SELECT * FROM dbo.f_TimKiemKho(N'{find}') WHERE HSD >= GetDATE()");
            return db.LayDanhSach(query);
        }

        public DataTable TimKiem_HetHan(string find)
        {
            string query = string.Format($"SELECT * FROM dbo.f_TimKiemKho(N'{find}') WHERE HSD < GetDATE()");
            return db.LayDanhSach(query);
        }
    }
}
