using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuanLyCongDanThanhPho
{
    internal class KetHonDAO
    {
        DBConnection exec = new DBConnection();

        public DataTable LayDanhSach()
        {
            string sqlStr = string.Format("SELECT * FROM dbo.vKetHon");
            return exec.LayDanhSach(sqlStr);
        }

        public DataTable LayDanhSachCCCD(int gioitinh)
        {
            string sqlStr = string.Format($"SELECT CCCD FROM dbo.CongDan JOIN dbo.CanCuocCongDan ON dbo.CanCuocCongDan.MaCD = dbo.CongDan.MaCD WHERE GioiTinh = {gioitinh}");
            return exec.LayDanhSach(sqlStr);
        }

        public void Them(KetHon kh)
        {
            string sqlStr = string.Format($"INSERT INTO dbo.KetHon (CCCDChong, CCCDVo, NgayDangKy) VALUES (N'{kh.CCCDChong}', N'{kh.CCCDVo}', '{kh.NgayDangKy.ToString("yyyy-MM-dd")}')");
            exec.Execute(sqlStr);
        }

        public void Xoa(KetHon kh)
        {
            string sqlStr = string.Format($"DELETE FROM dbo.KetHon WHERE MaKH = {kh.MaKH}");
            exec.Execute(sqlStr);
        }

        public DataTable TimKiem(string find)
        {
            string sqlStr = string.Format($"SELECT * FROM dbo.fTimKiemKetHon(N'{find}')");
            return exec.LayDanhSach(sqlStr);
        }

        public KetHon LayThongTinKetHonBangMaKH(int maho)
        {
            string sqlstr = string.Format("SELECT * FROM dbo.KetHon WHERE MaKH = {0}", maho);
            DataTable dt = exec.LayDanhSach(sqlstr);

            foreach (DataRow dr in dt.Rows)
                return new KetHon(dr);
            return null;
        }

        public KetHon LayThongTinKetHonBangCCCD(string cccd)
        {
            string sqlstr = string.Format($"SELECT* FROM dbo.KetHon WHERE(CCCDChong = N'{cccd}' OR CCCDVo = N'{cccd}') AND MaKH = (SELECT MAX(MaKH) FROM dbo.KetHon WHERE CCCDChong = N'{cccd}' OR CCCDVo = N'{cccd}')");
            DataTable dt = exec.LayDanhSach(sqlstr);

            foreach (DataRow dr in dt.Rows)
                return new KetHon(dr);
            return null;
        }
    }
}
