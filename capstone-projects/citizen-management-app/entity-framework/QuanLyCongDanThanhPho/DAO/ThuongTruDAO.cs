using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuanLyCongDanThanhPho
{
    public class ThuongTruDAO
    {
        DBConnection exec = new DBConnection();

        public DataTable LayDanhSach(int maho)
        {
            string sqlStr = string.Format($"SELECT * FROM dbo.vThuongTru WHERE MaHo = {maho}");
            return exec.LayDanhSach(sqlStr);
        }

        public ThuongTru LayThongTinThuongTruBangMaCD(int macd)
        {
            string sqlstr = string.Format("SELECT * FROM dbo.ThuongTru WHERE MaCD = {0}", macd);
            DataTable dt = exec.LayDanhSach(sqlstr);

            foreach (DataRow dr in dt.Rows)
                return new ThuongTru(dr);
            return null;
        }

        public void Them(ThuongTru tt)
        {
            string sqlStr = string.Format($"INSERT INTO dbo.ThuongTru (MaHo, MaCD, QuanHeVoiChuHo, NgayDangKy) VALUES ({tt.MaHo}, {tt.MaCD}, N'{tt.QuanHeVoiChuHo}', N'{tt.NgayDangKy.ToString("yyyy-MM-dd")}')");
            exec.Execute(sqlStr);
        }

        public void Sua(ThuongTru tt)
        {
            string sqlStr = string.Format($"UPDATE dbo.ThuongTru SET QuanHeVoiChuHo = N'{tt.QuanHeVoiChuHo}' WHERE MaCD = {tt.MaCD}");
            exec.Execute(sqlStr);
        }

        public void Xoa(ThuongTru tt)
        {
            string sqlStr = string.Format($"DELETE FROM dbo.ThuongTru WHERE MaCD = {tt.MaCD}");
            exec.Execute(sqlStr);
        }

        public DataTable TimKiem(int maho, string find)
        {
            string sqlStr = string.Format($"SELECT * FROM dbo.fTimKiemThuongTru(N'{find}') WHERE MaHo = {maho}");
            return exec.LayDanhSach(sqlStr);
        }
    }
}
