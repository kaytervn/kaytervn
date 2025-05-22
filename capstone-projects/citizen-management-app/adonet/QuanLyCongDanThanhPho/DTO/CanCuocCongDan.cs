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
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public CanCuocCongDan()
        {
            this.HoKhaus = new HashSet<HoKhau>();
            this.KetHons = new HashSet<KetHon>();
            this.KetHons1 = new HashSet<KetHon>();
            this.KhaiTus = new HashSet<KhaiTu>();
            this.Thues = new HashSet<Thue>();
        }

        public string CCCD { get; set; }
        public int MaCD { get; set; }
        public System.DateTime NgayDangKy { get; set; }

        public virtual CongDan CongDan { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<HoKhau> HoKhaus { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<KetHon> KetHons { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<KetHon> KetHons1 { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<KhaiTu> KhaiTus { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Thue> Thues { get; set; }

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
