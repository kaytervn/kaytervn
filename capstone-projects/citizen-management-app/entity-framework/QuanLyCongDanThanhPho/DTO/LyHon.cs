using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuanLyCongDanThanhPho
{
    public partial class LyHon
    {
        KetHonDAO khDAO = new KetHonDAO();

        public LyHon(int makh, string lydo, DateTime ngaydangky)
        {
            MaKH = makh;
            LyDo = lydo;
            NgayDangKy = ngaydangky;
            KetHon = khDAO.LayThongTinKetHonBangMaKH(MaKH);
        }

        public LyHon(DataRow row)
        {
            this.MaKH = (int)row["MaKH"];
            this.LyDo = (string)row["LyDo"];
            this.NgayDangKy = (DateTime)row["NgayDangKy"];
            KetHon = khDAO.LayThongTinKetHonBangMaKH(MaKH);
        }
    }
}
