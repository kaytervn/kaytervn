using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuanLyCongDanThanhPho
{
    public partial class TamTruTamVang
    {
        public int MaHo { get; set; }
        public int MaCD { get; set; }
        public int TinhTrangCuTru { get; set; }
        public System.DateTime NgayDangKy { get; set; }

        public virtual CongDan CongDan { get; set; }
        public virtual HoKhau HoKhau { get; set; }

        CongDanDAO cdDAO = new CongDanDAO();
        HoKhauDAO hkDAO = new HoKhauDAO();

        public enum enTTTV
        {
            TamTru = 1,
            TamVang = 0
        };

        public TamTruTamVang(int maho, int macd, int ttct, DateTime ngaydk)
        {
            this.MaHo = maho;
            this.MaCD = macd;
            this.TinhTrangCuTru = ttct;
            this.NgayDangKy = ngaydk;
            this.CongDan = cdDAO.LayThongTinCongDanBangMaCD(MaCD);
            this.HoKhau = hkDAO.LayThongTinHoKhauBangMaHo(MaHo);
        }

        public TamTruTamVang(DataRow row)
        {
            this.MaHo = (int)row["MaHo"];
            this.MaCD = (int)row["MaCD"];
            this.TinhTrangCuTru = (int)row["TinhTrangCuTru"];
            this.NgayDangKy = (DateTime)row["NgayDangKy"];
            this.CongDan = cdDAO.LayThongTinCongDanBangMaCD(MaCD);
            this.HoKhau = hkDAO.LayThongTinHoKhauBangMaHo(MaHo);
        }
    }
}
