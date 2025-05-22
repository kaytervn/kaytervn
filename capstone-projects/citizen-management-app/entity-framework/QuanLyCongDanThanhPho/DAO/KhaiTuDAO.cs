using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuanLyCongDanThanhPho
{
    internal class KhaiTuDAO
    {
        DBConnection exec = new DBConnection();

        public DataTable LayDanhSach()
        {
            string sqlStr = string.Format("SELECT * FROM dbo.vKhaiTu");
            return exec.LayDanhSach(sqlStr);
        }

        public void Them(KhaiTu kt)
        {
            string sqlStr = string.Format($"INSERT INTO dbo.KhaiTu (MaCD, NguyenNhan, NgayTu, NgayKhai, NguoiKhai, QuanHeVoiNguoiDuocKhai) VALUES ({kt.MaCD}, N'{kt.NguyenNhan}', '{kt.NgayTu.ToString("yyyy-MM-dd")}', '{kt.NgayKhai.ToString("yyyy-MM-dd")}', N'{kt.NguoiKhai}', N'{kt.QuanHeVoiNguoiDuocKhai}')");
            exec.Execute(sqlStr);
        }

        public void Sua(KhaiTu kt)
        {
            string sqlStr = $"UPDATE dbo.KhaiTu SET NguyenNhan = N'{kt.NguyenNhan}', NgayTu = '{kt.NgayTu.ToString("yyyy-MM-dd")}', NguoiKhai = N'{kt.NguoiKhai}', QuanHeVoiNguoiDuocKhai = N'{kt.QuanHeVoiNguoiDuocKhai}' WHERE MaCD = {kt.MaCD}";
            exec.Execute(sqlStr);
        }

        public void Xoa(KhaiTu kt)
        {
            string sqlStr = string.Format($"DELETE FROM dbo.KhaiTu WHERE MaCD = {kt.MaCD}");
            exec.Execute(sqlStr);
        }

        public DataTable TimKiem(string find)
        {
            string sqlStr = string.Format($"SELECT * FROM dbo.fTimKiemKhaiTu(N'{find}')");
            return exec.LayDanhSach(sqlStr);
        }

        public KhaiTu LayThongTinKhaiTuBangMaCD(int macd)
        {
            string sqlstr = string.Format("SELECT * FROM dbo.KhaiTu WHERE MaCD = {0}", macd);
            DataTable dt = exec.LayDanhSach(sqlstr);

            foreach (DataRow dr in dt.Rows)
                return new KhaiTu(dr);
            return null;
        }
    }
}
