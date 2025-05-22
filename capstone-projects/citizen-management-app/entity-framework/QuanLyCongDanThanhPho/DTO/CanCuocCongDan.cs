using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuanLyCongDanThanhPho
{
    public partial class CanCuocCongDan
    {
        CongDanDAO cdDAO = new CongDanDAO();

        public CanCuocCongDan(string cCCD, int maCD, DateTime ngayDangKy)
        {
            CCCD = cCCD;
            MaCD = maCD;
            NgayDangKy = ngayDangKy;
            CongDan = cdDAO.LayThongTinCongDanBangMaCD(maCD);
        }

        public CanCuocCongDan(DataRow row)
        {
            this.CCCD = (string)row["CCCD"];
            this.MaCD = (int)row["MaCD"];
            this.NgayDangKy = (DateTime)row["NgayDangKy"];
            this.CongDan = cdDAO.LayThongTinCongDanBangMaCD(MaCD);
        }
    }
}
