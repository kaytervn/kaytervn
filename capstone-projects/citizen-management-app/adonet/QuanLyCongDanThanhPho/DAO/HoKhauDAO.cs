using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace QuanLyCongDanThanhPho
{
    public class HoKhauDAO
    {
        DBConnection exec = new DBConnection();
        ThuongTruDAO ttDAO = new ThuongTruDAO();

        public DataTable LayDanhSach()
        {
            string sqlStr = string.Format("SELECT * FROM dbo.vHoKhau");
            return exec.LayDanhSach(sqlStr);
        }

        public HoKhau LayThongTinHoKhauBangMaHo(int maho)
        {
            string sqlstr = string.Format("SELECT * FROM dbo.HoKhau WHERE MaHo = {0}", maho);
            DataTable dt = exec.LayDanhSach(sqlstr);

            foreach (DataRow dr in dt.Rows)
                return new HoKhau(dr);
            return null;
        }

        public HoKhau LayThongTinHoKhauBangChuHo(string chuho)
        {
            string sqlstr = string.Format("SELECT * FROM dbo.HoKhau WHERE ChuHo = N'{0}'", chuho);
            DataTable dt = exec.LayDanhSach(sqlstr);

            foreach (DataRow dr in dt.Rows)
                return new HoKhau(dr);
            return null;
        }

        public int DemSoLuongCongDanCoThuocHo(HoKhau hk)
        {
            string sqlStr1 = string.Format($"SELECT * FROM dbo.ThuongTru WHERE MaHo = {hk.MaHo}");
            DataTable check = exec.LayDanhSach(sqlStr1);
            return check.Rows.Count;
        }

        public bool KiemTraCongDanCoThuocHoNaoChua(HoKhau hk)
        {
            string sqlStr1 = string.Format($"SELECT * FROM dbo.ThuongTru WHERE MaCD = {hk.CanCuocCongDan.MaCD}");
            DataTable check = exec.LayDanhSach(sqlStr1);
            if (check.Rows.Count > 0) return true;
            else return false;

        }

        public bool KiemTraCongDanCoThuocHo(HoKhau hk)
        {
            string sqlStr1 = string.Format($"SELECT * FROM dbo.ThuongTru WHERE MaCD = {hk.CanCuocCongDan.MaCD} AND MaHo = {hk.MaHo}");
            DataTable check = exec.LayDanhSach(sqlStr1);
            if (check.Rows.Count > 0) return true;
            else return false;

        }

        public bool KiemTraCongDanCoThuocHo(int macd, int maho)
        {
            string sqlStr1 = string.Format($"SELECT * FROM dbo.ThuongTru WHERE MaCD = {macd} AND MaHo = {maho}");
            DataTable check = exec.LayDanhSach(sqlStr1);
            if (check.Rows.Count > 0) return true;
            else return false;

        }

        public void Them(HoKhau hk)
        {
            string sqlStr1 = string.Format($"INSERT INTO dbo.HoKhau (ChuHo, TinhThanh, QuanHuyen, PhuongXa, NgayDangKy) VALUES (N'{hk.ChuHo}', N'{hk.TinhThanh}', N'{hk.QuanHuyen}', N'{hk.PhuongXa}', N'{hk.NgayDangKy.ToString("yyyy-MM-dd")}')");
            exec.Execute(sqlStr1);
            HoKhau nKH = LayThongTinHoKhauBangChuHo(hk.ChuHo);
            ThuongTru tt = new ThuongTru(nKH.MaHo, hk.CanCuocCongDan.MaCD, "Là chủ hộ", DateTime.Today);
            ttDAO.Them(tt);
        }

        public void Sua(HoKhau hk)
        {
            string sqlStr = string.Format($"UPDATE dbo.HoKhau SET ChuHo = N'{hk.ChuHo}', TinhThanh = N'{hk.TinhThanh}', QuanHuyen = N'{hk.QuanHuyen}',PhuongXa = N'{hk.PhuongXa}' WHERE MaHo = {hk.MaHo}");
            exec.Execute(sqlStr);
        }

        public void Xoa(HoKhau hk)
        {
            string sqlStr = string.Format($"DELETE FROM dbo.HoKhau WHERE MaHo = {hk.MaHo}");
            exec.Execute(sqlStr);
        }

        public DataTable TimKiem(string find)
        {
            string sqlStr = string.Format($"SELECT * FROM dbo.fTimKiemHoKhau(N'{find}')");
            return exec.LayDanhSach(sqlStr);
        }
    }
}
