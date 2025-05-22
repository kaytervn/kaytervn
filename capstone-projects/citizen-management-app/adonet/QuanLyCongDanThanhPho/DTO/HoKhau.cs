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
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public HoKhau()
        {
            this.TamTruTamVangs = new HashSet<TamTruTamVang>();
            this.ThuongTrus = new HashSet<ThuongTru>();
        }

        public int MaHo { get; set; }
        public string ChuHo { get; set; }
        public string TinhThanh { get; set; }
        public string QuanHuyen { get; set; }
        public string PhuongXa { get; set; }
        public System.DateTime NgayDangKy { get; set; }

        public virtual CanCuocCongDan CanCuocCongDan { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<TamTruTamVang> TamTruTamVangs { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<ThuongTru> ThuongTrus { get; set; }

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
