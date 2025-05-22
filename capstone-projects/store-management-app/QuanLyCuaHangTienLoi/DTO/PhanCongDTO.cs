using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Net.Mime.MediaTypeNames;
using static System.Windows.Forms.VisualStyles.VisualStyleElement.ListView;

namespace QuanLyCuaHangTienLoi
{
    public partial class PhanCong
    {
        NhanVienDAO nvDAO = new NhanVienDAO();
        CaDAO caDAO = new CaDAO();

        public PhanCong(int maPC, string maNV, string maCa, DateTime ngayDangKy)
        {
            MaPC = maPC;
            MaNV = maNV;
            MaCa = maCa;
            NgayDangKy = ngayDangKy;
            Ca = caDAO.LayThongTinCaBangMaCa(maCa);
            NhanVien = nvDAO.LayThongTinNhanVienBangMaNV(maNV);
        }

        public PhanCong(DataRow row)
        {
            MaPC = (int)row["MaPC"];
            MaNV = (string)row["MaNV"];
            MaCa = (string)row["MaCa"];
            NgayDangKy = (DateTime)row["NgayDangKy"];
            Ca = caDAO.LayThongTinCaBangMaCa(MaCa);
            NhanVien = nvDAO.LayThongTinNhanVienBangMaNV(MaNV);
        }
    }
}
