using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Windows.Forms.VisualStyles.VisualStyleElement.ProgressBar;

namespace QuanLyCongDanThanhPho
{
    public partial class KetHon
    {
        CanCuocCongDanDAO cccdDAO = new CanCuocCongDanDAO();
        
        public KetHon(int maKH, string cCCDChong, string cCCDVo, DateTime ngayDangKy)
        {
            MaKH = maKH;
            CCCDChong = cCCDChong;
            CCCDVo = cCCDVo;
            NgayDangKy = ngayDangKy;
            CanCuocCongDan = cccdDAO.LayThongTinCanCuocCongDanBangCCCD(CCCDChong);
            CanCuocCongDan1 = cccdDAO.LayThongTinCanCuocCongDanBangCCCD(CCCDVo);
        }

        public KetHon(DataRow row)
        {
            this.MaKH = (int)row["MaKH"];
            this.CCCDChong = (string)row["CCCDChong"];
            this.CCCDVo = (string)row["CCCDVo"];
            this.NgayDangKy = (DateTime)row["NgayDangKy"];
            this.CanCuocCongDan = cccdDAO.LayThongTinCanCuocCongDanBangCCCD(CCCDChong);
            this.CanCuocCongDan1 = cccdDAO.LayThongTinCanCuocCongDanBangCCCD(CCCDVo);
        }
    }
}
