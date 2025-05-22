using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuanLyCongDanThanhPho
{
    internal class LyHonDAO
    {
        DBConnection exec = new DBConnection();

        public DataTable LayDanhSach()
        {
            string sqlStr = string.Format("SELECT * FROM dbo.vLyHon");
            return exec.LayDanhSach(sqlStr);
        }

        public void Them(LyHon lh)
        {
            string sqlStr = string.Format($"INSERT INTO dbo.LyHon (MaKH, LyDo, NgayDangKy) VALUES ({lh.MaKH}, N'{lh.LyDo}', N'{lh.NgayDangKy.ToString("yyyy-MM-dd")}')");
            exec.Execute(sqlStr);
        }

        public void Xoa(LyHon lh)
        {
            string sqlStr = string.Format($"DELETE FROM dbo.LyHon WHERE MaKH = {lh.MaKH}");
            exec.Execute(sqlStr);
        }

        public DataTable TimKiem(string find)
        {
            string sqlStr = string.Format($"SELECT * FROM dbo.fTimKiemLyHon(N'{find}')");
            return exec.LayDanhSach(sqlStr);
        }

        public LyHon LayThongTinLyHonBangMaKH(int maho)
        {
            string sqlstr = string.Format("SELECT * FROM dbo.LyHon WHERE MaKH = {0}", maho);
            DataTable dt = exec.LayDanhSach(sqlstr);

            foreach (DataRow dr in dt.Rows)
                return new LyHon(dr);
            return null;
        }
    }
}
