using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuanLyCuaHangTienLoi
{
    internal class PhanCongDAO
    {
        DBConnection exec = new DBConnection(Program.nv);

        public DataTable LayDanhSach()
        {
            return exec.LayDanhSach("Select * from XemBangPC_NhanVien");
        }

        public DataTable LayDanhSach(string manv)
        {
            return exec.LayDanhSach($"Select * from XemBangPC_NhanVien WHERE MaNV = N'{manv}'");
        }

        public PhanCong LayThongTinPhanCongBangMaPC(int macv)
        {
            string query = string.Format($"SELECT * FROM dbo.PhanCong WHERE MaPC = {macv}");
            DataTable result = exec.LayDanhSach(query);

            foreach (DataRow dr in result.Rows)
            {
                return new PhanCong(dr);
            }
            return null;
        }

        public void Them(PhanCong pc)
        {
            string query = string.Format($"EXEC dbo.sp_ThemPhanCong " +
                                            $"@manv = N'{pc.MaNV}'," +
                                            $"@maca = N'{pc.MaCa}'," +
                                            $"@ngaydangky = '{pc.NgayDangKy.ToString("yyyy-MM-dd")}'");
            exec.Execute(query);
        }

        public void Xoa(PhanCong pc)
        {
            string query = string.Format($"EXEC dbo.sp_XoaPhanCong @mapc = {pc.MaPC}");
            exec.Execute(query);
        }

        public DataTable TimKiem(string find)
        {
            string query = string.Format($"SELECT * FROM dbo.f_TimKiemPhanCong(N'{find}')");
            return exec.LayDanhSach(query);
        }
    }
}
