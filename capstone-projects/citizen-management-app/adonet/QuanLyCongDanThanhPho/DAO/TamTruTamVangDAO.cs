using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuanLyCongDanThanhPho
{
    internal class TamTruTamVangDAO
    {
        DBConnection exec = new DBConnection();

        public DataTable LayDanhSach()
        {
            string sqlStr = string.Format($"SELECT * FROM dbo.vTamTruTamVang");
            return exec.LayDanhSach(sqlStr);
        }

        public DataTable LayDanhSach(int macd)
        {
            string sqlStr = string.Format($"SELECT * FROM dbo.vTamTruTamVang WHERE MaCD = {macd}");
            return exec.LayDanhSach(sqlStr);
        }

        public DataTable LayDanhSach_ConHan()
        {
            string sqlStr = string.Format("SELECT * FROM dbo.vTamTruTamVang WHERE DATEDIFF(DAY, NgayDangKy, GETDATE()) <= 730");
            return exec.LayDanhSach(sqlStr);
        }

        public DataTable LayDanhSach_QuaHan()
        {
            string sqlStr = string.Format("SELECT * FROM dbo.vTamTruTamVang WHERE DATEDIFF(DAY, NgayDangKy, GETDATE()) > 730");
            return exec.LayDanhSach(sqlStr);
        }

        public void Them(TamTruTamVang tttv)
        {
            string sqlStr = string.Format($"INSERT INTO dbo.TamTruTamVang(MaHo, MaCD, TinhTrangCuTru, NgayDangKy) VALUES ({tttv.MaHo}, {tttv.MaCD}, {tttv.TinhTrangCuTru}, N'{tttv.NgayDangKy.ToString("yyyy-MM-dd")}')");
            exec.Execute(sqlStr);
        }

        public void GiaHan(TamTruTamVang tttv)
        {
            string sqlStr = string.Format($"UPDATE dbo.TamTruTamVang SET NgayDangKy = N'{DateTime.Today.ToString("yyyy-MM-dd")}' WHERE MaCD = {tttv.MaCD} AND MaHo = {tttv.MaHo}");
            exec.Execute(sqlStr);
        }

        public void Xoa(TamTruTamVang tttv)
        {
            string sqlStr = string.Format($"DELETE FROM dbo.TamTruTamVang WHERE MaCD = {tttv.MaCD} AND MaHo = {tttv.MaHo}");
            exec.Execute(sqlStr);
        }

        public DataTable TimKiem(string find)
        {
            string sqlStr = string.Format($"SELECT * FROM dbo.fTimKiemTamTruTamVang(N'{find}')");
            return exec.LayDanhSach(sqlStr);
        }

        public DataTable TimKiem(int macd, string find)
        {
            string sqlStr = string.Format($"SELECT * FROM dbo.fTimKiemTamTruTamVang(N'{find}') WHERE MaCD = {macd}");
            return exec.LayDanhSach(sqlStr);
        }

        public DataTable TimKiem_ConHan(string find)
        {
            string sqlStr = string.Format($"SELECT * FROM dbo.fTimKiemTamTruTamVang(N'{find}') WHERE DATEDIFF(DAY, NgayDangKy, GETDATE()) <= 730");
            return exec.LayDanhSach(sqlStr);
        }

        public DataTable TimKiem_QuaHan(string find)
        {
            string sqlStr = string.Format($"SELECT * FROM dbo.fTimKiemTamTruTamVang(N'{find}') WHERE DATEDIFF(DAY, NgayDangKy, GETDATE()) > 730");
            return exec.LayDanhSach(sqlStr);
        }

        public TamTruTamVang LayThongTinTamTruTamVangBangMaCDVaMaHo(int macd, int maho)
        {
            string sqlstr = string.Format($"SELECT * FROM dbo.TamTruTamVang WHERE MaCD = {macd} AND MaHo = {maho}");
            DataTable dt = exec.LayDanhSach(sqlstr);

            foreach (DataRow dr in dt.Rows)
                return new TamTruTamVang(dr);
            return null;
        }
    }
}
