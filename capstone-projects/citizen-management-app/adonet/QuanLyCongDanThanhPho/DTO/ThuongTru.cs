using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Windows.Forms.VisualStyles.VisualStyleElement.ProgressBar;

namespace QuanLyCongDanThanhPho
{
    public partial class ThuongTru
    {
        public int MaCD { get; set; }
        public int MaHo { get; set; }
        public string QuanHeVoiChuHo { get; set; }
        public System.DateTime NgayDangKy { get; set; }

        public virtual CongDan CongDan { get; set; }
        public virtual HoKhau HoKhau { get; set; }

        CongDanDAO cdDAO = new CongDanDAO();
        HoKhauDAO hkDAO = new HoKhauDAO();

        public ThuongTru(int maHo, int maCD, string quanHeVoiChuHo, DateTime ngayDangKy)
        {
            MaHo = maHo;
            MaCD = maCD;
            QuanHeVoiChuHo = quanHeVoiChuHo;
            NgayDangKy = ngayDangKy;
            CongDan = cdDAO.LayThongTinCongDanBangMaCD(MaCD);
            HoKhau = hkDAO.LayThongTinHoKhauBangMaHo(MaHo);
        }

        public ThuongTru(DataRow row)
        {
            this.MaHo = (int)row["MaHo"];
            this.MaCD = (int)row["MaCD"];
            this.QuanHeVoiChuHo = (string)row["QuanHeVoiChuHo"];
            this.NgayDangKy = (DateTime)row["NgayDangKy"];
            CongDan = cdDAO.LayThongTinCongDanBangMaCD(MaCD);
            HoKhau = hkDAO.LayThongTinHoKhauBangMaHo(MaHo);
        }
    }
}
