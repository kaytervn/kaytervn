using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Data;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace QuanLyCongDanThanhPho
{
    internal class KhaiSinhDAO
    {
        DBConnection exec = new DBConnection();
        CongDanDAO cdDAO = new CongDanDAO();

        public DataTable LayDanhSach()
        {
            string sqlStr = string.Format("SELECT * FROM dbo.vKhaiSinh");
            return exec.LayDanhSach(sqlStr);
        }

        public void Them(KhaiSinh ks)
        {
            string sqlStr = string.Format($"INSERT INTO dbo.KhaiSinh (MaCD, MaKH, NgayKhai) VALUES ({ks.MaCD}, {ks.MaKH}, N'{ks.NgayKhai.ToString("yyyy-MM-dd")}')");
            exec.Execute(sqlStr);
        }

        public void Xoa(KhaiSinh ks)
        {
            string sqlStr = string.Format("DELETE FROM dbo.KhaiSinh WHERE MaCD = {0}", ks.MaCD);
            exec.Execute(sqlStr);
        }

        public void Sua(KhaiSinh ks)
        {
            string sqlStr = $"UPDATE dbo.KhaiSinh SET MaKH = {ks.MaKH} WHERE MaCD = {ks.MaCD}";
            exec.Execute(sqlStr);
        }

        public DataTable TimKiem(string find)
        {
            string sqlStr = string.Format($"SELECT * FROM dbo.fTimKiemKhaiSinh(N'{find}')");
            return exec.LayDanhSach(sqlStr);
        }

        public KhaiSinh LayThongTinKhaiSinhhBangMaCD(int macd)
        {
            string sqlstr = string.Format("SELECT * FROM dbo.KhaiSinh WHERE MaCD = {0}", macd);
            DataTable dt = exec.LayDanhSach(sqlstr);

            foreach (DataRow dr in dt.Rows)
                return new KhaiSinh(dr);
            return null;
        }
    }
}
