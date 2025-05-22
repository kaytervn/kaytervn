using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuanLyCongDanThanhPho
{
    public class CanCuocCongDanDAO
    {
        DBConnection exec = new DBConnection();

        string DatSoCCCD()
        {
            string maCCCD = "CD" + new Random().Next(10000000, 99999999).ToString("D8");
            int query = exec.Execute($"SELECT * FROM dbo.vCanCuocCongDan WHERE CCCD = N'{maCCCD}'");

            while (query > 0)
            {
                maCCCD = "CD" + new Random().Next(10000000, 99999999).ToString("D8");
                query = exec.Execute($"SELECT * FROM dbo.vCanCuocCongDan WHERE CCCD = N'{maCCCD}'");
            }

            return maCCCD;
        }

        public DataTable LayDanhSach()
        {
            string sqlStr = string.Format("SELECT * FROM dbo.vCanCuocCongDan");
            return exec.LayDanhSach(sqlStr);
        }

        public DataTable LayDanhSach_ConHan()
        {
            string sqlStr = string.Format("SELECT * FROM dbo.vCanCuocCongDan WHERE DATEDIFF(DAY, NgayDangKy, GETDATE()) <= 5475");
            return exec.LayDanhSach(sqlStr);
        }

        public DataTable LayDanhSach_QuaHan()
        {
            string sqlStr = string.Format("SELECT * FROM dbo.vCanCuocCongDan WHERE DATEDIFF(DAY, NgayDangKy, GETDATE()) > 5475");
            return exec.LayDanhSach(sqlStr);
        }

        public CanCuocCongDan LayThongTinCanCuocCongDanBangCCCD(string cccd)
        {
            string sqlstr = string.Format("SELECT * FROM dbo.CanCuocCongDan WHERE CCCD = '{0}'", cccd);
            DataTable dt = exec.LayDanhSach(sqlstr);

            foreach (DataRow dr in dt.Rows)
                return new CanCuocCongDan(dr);
            return null;
        }

        public void Them(CanCuocCongDan cccd)
        {
            string sqlStr = string.Format($"INSERT INTO dbo.CanCuocCongDan(CCCD, MaCD, NgayDangKy) VALUES(N'{DatSoCCCD()}', {cccd.MaCD}, '{cccd.NgayDangKy.ToString("yyyy-MM-dd")}')");
            exec.Execute(sqlStr);
        }

        public void GiaHan(CanCuocCongDan cccd)
        {
            string sqlStr = string.Format($"UPDATE dbo.CanCuocCongDan SET NgayDangKy = N'{DateTime.Today.ToString("yyyy-MM-dd")}' WHERE MaCD = {cccd.MaCD}");
            exec.Execute(sqlStr);
        }

        public void Xoa(CanCuocCongDan cccd)
        {
            string sqlStr = string.Format($"DELETE FROM dbo.CanCuocCongDan WHERE CCCD = N'{cccd.CCCD}'");
            exec.Execute(sqlStr);
        }

        public DataTable TimKiem(string find)
        {
            string sqlStr = string.Format($"SELECT * FROM dbo.fTimKiemCanCuocCongDan(N'{find}')");
            return exec.LayDanhSach(sqlStr);
        }

        public DataTable TimKiem_ConHan(string find)
        {
            string sqlStr = string.Format($"SELECT * FROM dbo.fTimKiemCanCuocCongDan(N'{find}') WHERE DATEDIFF(DAY, NgayDangKy, GETDATE()) <= 5475");
            return exec.LayDanhSach(sqlStr);
        }

        public DataTable TimKiem_QuaHan(string find)
        {
            string sqlStr = string.Format($"SELECT * FROM dbo.fTimKiemCanCuocCongDan(N'{find}') WHERE DATEDIFF(DAY, NgayDangKy, GETDATE()) > 5475");
            return exec.LayDanhSach(sqlStr);
        }

        public CanCuocCongDan LayThongTinCanCuocCongDanBangMaCD(int macd)
        {
            string sqlstr = string.Format("SELECT * FROM dbo.CanCuocCongDan WHERE MaCD = {0}", macd);
            DataTable dt = exec.LayDanhSach(sqlstr);

            foreach (DataRow dr in dt.Rows)
                return new CanCuocCongDan(dr);
            return null;
        }
    }
}
