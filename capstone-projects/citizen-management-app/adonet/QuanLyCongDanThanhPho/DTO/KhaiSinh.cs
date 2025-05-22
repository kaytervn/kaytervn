using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuanLyCongDanThanhPho
{
    public partial class KhaiSinh
    {
        public int MaCD { get; set; }
        public int MaKH { get; set; }
        public System.DateTime NgayKhai { get; set; }

        public virtual CongDan CongDan { get; set; }
        public virtual KetHon KetHon { get; set; }

        KetHonDAO khDAO = new KetHonDAO();
        CongDanDAO cdDAO = new CongDanDAO();

        public KhaiSinh(int maCD, int maKH, DateTime ngayKhai)
        {
            MaCD = maCD;
            MaKH = maKH;
            NgayKhai = ngayKhai;
            CongDan = cdDAO.LayThongTinCongDanBangMaCD(MaCD);
            KetHon = khDAO.LayThongTinKetHonBangMaKH(MaKH);
        }

        public KhaiSinh(DataRow row)
        {
            this.MaCD = (int)row["MaCD"];
            this.MaKH = (int)row["MaKH"];
            this.NgayKhai = (DateTime)row["NgayKhai"];
            this.CongDan = cdDAO.LayThongTinCongDanBangMaCD(MaCD);
            KetHon = khDAO.LayThongTinKetHonBangMaKH(MaKH);
        }
    }
}
