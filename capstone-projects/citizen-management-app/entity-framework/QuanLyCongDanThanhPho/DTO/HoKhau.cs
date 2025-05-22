using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Windows.Forms.VisualStyles.VisualStyleElement.ProgressBar;

namespace QuanLyCongDanThanhPho
{
    public partial class HoKhau
    {
        CanCuocCongDanDAO cccdDAO = new CanCuocCongDanDAO();

        public HoKhau(int maHo, string chuHo, string tinhThanh, string quanHuyen, string phuongXa, DateTime ngayDangKy)
        {
            MaHo = maHo;
            ChuHo = chuHo;
            TinhThanh = tinhThanh;
            QuanHuyen = quanHuyen;
            PhuongXa = phuongXa;
            NgayDangKy = ngayDangKy;
            CanCuocCongDan = cccdDAO.LayThongTinCanCuocCongDanBangCCCD(chuHo);
        }

        public HoKhau(DataRow row)
        {
            this.MaHo = (int)row["MaHo"];
            this.ChuHo = (string)row["ChuHo"];
            this.TinhThanh = (string)row["TinhThanh"];
            this.QuanHuyen = (string)row["QuanHuyen"];
            this.PhuongXa = (string)row["PhuongXa"];
            this.NgayDangKy = (DateTime)row["NgayDangKy"];
            this.CanCuocCongDan = cccdDAO.LayThongTinCanCuocCongDanBangCCCD(ChuHo);
        }
    }
}
