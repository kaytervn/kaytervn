using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuanLyCongDanThanhPho
{
    internal class ThueDAO
    {
        DBConnection exec = new DBConnection();

        public DataTable LayDanhSach()
        {
            string sqlStr = string.Format("SELECT * FROM dbo.vThue");
            return exec.LayDanhSach(sqlStr);
        }

        public DataTable LayDanhSach(string cccd)
        {
            string sqlStr = string.Format($"SELECT * FROM dbo.vThue WHERE CCCD = '{cccd}'");
            return exec.LayDanhSach(sqlStr);
        }

        public DataTable LayDanhSach_ConHan()
        {
            string sqlStr = string.Format("SELECT * FROM dbo.vThue WHERE DATEDIFF(DAY, Ngay, GETDATE()) <= 30");
            return exec.LayDanhSach(sqlStr);
        }

        public DataTable LayDanhSach_QuaHan()
        {
            string sqlStr = string.Format("SELECT * FROM dbo.vThue WHERE DATEDIFF(DAY, Ngay, GETDATE()) > 30");
            return exec.LayDanhSach(sqlStr);
        }

        public void Them(Thue t)
        {
            string sqlStr = string.Format($"INSERT INTO dbo.Thue (TenThue, MucThue, CCCD, ThuNhap, Ngay) VALUES (N'{t.TenThue}', {t.MucThue}, N'{t.CCCD}', {t.ThuNhap}, N'{t.Ngay.ToString("yyyy-MM-dd")}')");
            exec.Execute(sqlStr);
        }

        public void Xoa(Thue t)
        {
            string sqlStr = string.Format($"DELETE FROM dbo.Thue WHERE MaThue = {t.MaThue}");
            exec.Execute(sqlStr);
        }

        public void Sua(Thue t)
        {
            string sqlStr = $"UPDATE dbo.Thue SET TenThue = N'{t.TenThue}', MucThue = {t.MucThue}, CCCD = N'{t.CCCD}', ThuNhap = {t.ThuNhap}, Ngay = N'{t.Ngay.ToString("yyyy-MM-dd")}' WHERE MaThue = {t.MaThue}";
            exec.Execute(sqlStr);
        }

        public DataTable TimKiem(string find)
        {
            string sqlStr = string.Format($"SELECT * FROM dbo.fTimKiemThue(N'{find}')");
            return exec.LayDanhSach(sqlStr);
        }

        public DataTable TimKiem(string cccd, string find)
        {
            string sqlStr = string.Format($"SELECT * FROM dbo.fTimKiemThue(N'{find}') WHERE CCCD = '{cccd}'");
            return exec.LayDanhSach(sqlStr);
        }

        public DataTable TimKiem_ConHan(string find)
        {
            string sqlStr = string.Format($"SELECT * FROM dbo.fTimKiemThue(N'{find}') WHERE DATEDIFF(DAY, Ngay, GETDATE()) <= 30");
            return exec.LayDanhSach(sqlStr);
        }

        public DataTable TimKiem_QuaHan(string find)
        {
            string sqlStr = string.Format($"SELECT * FROM dbo.fTimKiemThue(N'{find}') WHERE DATEDIFF(DAY, Ngay, GETDATE()) > 30");
            return exec.LayDanhSach(sqlStr);
        }

        public Thue LayThongTinThueBangMaThue(int mathue)
        {
            string sqlstr = string.Format("SELECT * FROM dbo.Thue WHERE MaThue = {0}", mathue);
            DataTable dt = exec.LayDanhSach(sqlstr);

            foreach (DataRow dr in dt.Rows)
                return new Thue(dr);
            return null;
        }
    }
}
