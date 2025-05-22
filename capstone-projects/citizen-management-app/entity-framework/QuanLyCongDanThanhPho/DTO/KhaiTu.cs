using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuanLyCongDanThanhPho
{
    public partial class KhaiTu
    {
        CongDanDAO cdDAO = new CongDanDAO();
        CanCuocCongDanDAO cccdDAO = new CanCuocCongDanDAO();

        public KhaiTu() { }

        public KhaiTu(int maCD, string nguyenNhan, DateTime ngayTu, DateTime ngayKhai, string nguoikhai, string quanhe)
        {
            MaCD = maCD;
            NguyenNhan = nguyenNhan;
            NgayTu = ngayTu;
            NgayKhai = ngayKhai;
            NguoiKhai = nguoikhai;
            QuanHeVoiNguoiDuocKhai = quanhe;
            CongDan = cdDAO.LayThongTinCongDanBangMaCD(MaCD);
            CanCuocCongDan = cccdDAO.LayThongTinCanCuocCongDanBangCCCD(NguoiKhai);
        }

        public KhaiTu(DataRow row)
        {
            this.MaCD = (int)row["MaCD"];
            this.NguyenNhan = (string)row["NguyenNhan"];
            this.NgayTu = (DateTime)row["NgayTu"];
            this.NgayKhai = (DateTime)row["NgayKhai"];
            this.NguoiKhai = (string)row["NguoiKhai"];
            this.QuanHeVoiNguoiDuocKhai = (string)row["QuanHeVoiNguoiDuocKhai"];
            this.CongDan = cdDAO.LayThongTinCongDanBangMaCD(MaCD);
            CanCuocCongDan = cccdDAO.LayThongTinCanCuocCongDanBangCCCD(NguoiKhai);
        }
    }
}
