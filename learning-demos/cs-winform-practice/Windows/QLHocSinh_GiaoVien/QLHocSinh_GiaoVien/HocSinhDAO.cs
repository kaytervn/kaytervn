using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.Diagnostics;

namespace QLHocSinh_GiaoVien
{
    public class HocSinhDAO
    {
        DBConnection exc = new DBConnection();

        public void Them(HocSinh hs)
        {
            string sqlStr = string.Format("INSERT INTO Hocsinh(Ten, Diachi, CMND, GioiTinh, NgaySinh) VALUES (N'{0}', N'{1}', '{2}', N'{3}', '{4}')", hs.HoTen, hs.DiaChi, hs.CMND, hs.GioiTinh, hs.NgaySinh);
            exc.Excute(sqlStr);
        }

        public void Xoa(HocSinh hs)
        {
            string sqlStr = string.Format("DELETE FROM HocSinh WHERE CMND = '{0}'", hs.CMND);
            exc.Excute(sqlStr);
        }

        public void Sua(HocSinh hs)
        {
            string sqlStr = string.Format("UPDATE HocSinh SET Ten = N'{0}', DiaChi = N'{1}', GioiTinh = N'{2}', NgaySinh = '{3}' Where CMND = '{4}'", hs.HoTen, hs.DiaChi, hs.GioiTinh, hs.NgaySinh, hs.CMND);
            exc.Excute(sqlStr);
        }

        public DataTable TimKiem(HocSinh hs)
        {
            string sqlStr = string.Format("SELECT * FROM HocSinh Where CMND = '{0}'", hs.CMND);
            return exc.TimKiem(sqlStr);
        }

        public DataTable LayDanhSach()
        {
            string sqlStr = string.Format("SELECT * FROM HocSinh");
            return exc.LayDanhSach(sqlStr);
        }
    }
}
