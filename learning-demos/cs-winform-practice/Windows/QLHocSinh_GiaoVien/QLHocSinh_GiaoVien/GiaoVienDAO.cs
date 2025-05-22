using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace QLHocSinh_GiaoVien
{
    internal class GiaoVienDAO
    {
        DBConnection exc = new DBConnection();

        public void Them(GiaoVien hs)
        {
            string sqlStr = string.Format("INSERT INTO GiaoVien(Ten, Diachi, CMND, GioiTinh, BoMon, NgaySinh) VALUES (N'{0}', N'{1}', N'{2}', N'{3}', N'{4}', N'{5}')", hs.HoTen, hs.DiaChi, hs.CMND, hs.GioiTinh, hs.BoMon, hs.NgaySinh);
            exc.Excute(sqlStr);
        }

        public void Xoa(GiaoVien hs)
        {
            string sqlStr = string.Format("DELETE FROM GiaoVien WHERE CMND = '{0}'", hs.CMND);
            exc.Excute(sqlStr);
        }

        public void Sua(GiaoVien hs)
        {
            string sqlStr = string.Format("UPDATE GiaoVien SET Ten = N'{0}', DiaChi = N'{1}', GioiTinh = N'{2}', BoMon = N'{3}', NgaySinh = '{4}' Where CMND = '{5}'", hs.HoTen, hs.DiaChi, hs.GioiTinh, hs.BoMon, hs.NgaySinh, hs.CMND);
            exc.Excute(sqlStr);
        }

        public DataTable TimKiem(GiaoVien hs)
        {
            string sqlStr = string.Format("SELECT * FROM GiaoVien Where CMND = '{0}'", hs.CMND);
            return exc.TimKiem(sqlStr);
        }

        public DataTable LayDanhSach()
        {
            string sqlStr = string.Format("SELECT * FROM GiaoVien");
            return exc.LayDanhSach(sqlStr);
        }
    }
}
