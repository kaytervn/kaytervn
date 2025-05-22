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
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public KetHon()
        {
            this.KhaiSinhs = new HashSet<KhaiSinh>();
        }

        public int MaKH { get; set; }
        public string CCCDChong { get; set; }
        public string CCCDVo { get; set; }
        public System.DateTime NgayDangKy { get; set; }

        public virtual CanCuocCongDan CanCuocCongDan { get; set; }
        public virtual CanCuocCongDan CanCuocCongDan1 { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<KhaiSinh> KhaiSinhs { get; set; }
        public virtual LyHon LyHon { get; set; }

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
