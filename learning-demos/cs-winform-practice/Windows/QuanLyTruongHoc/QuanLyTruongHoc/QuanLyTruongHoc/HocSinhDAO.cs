using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuanLyTruongHoc
{
    internal class HocSinhDAO
    {
        DBConnection exc = new DBConnection();

        public void Them(HocSinh hs)
        {
            string sqlStr = string.Format("INSERT INTO dbo.HocSinh (MaHS, Ten, QueQuan, NgayThangNamSinh, CMND, Email, SoDT, Diem) VALUES(N'{0}', N'{1}', N'{2}', N'{3}', N'{4}', N'{5}', N'{6}', {7})", hs.MaHS, hs.Ten, hs.QueQuan, hs.NgaySinh, hs.CMND1, hs.Email, hs.SoDT, hs.Diem);
            exc.Excute(sqlStr);
        }

        public void Xoa(HocSinh hs)
        {
            string sqlStr = string.Format("DELETE FROM HocSinh WHERE MaHS = '{0}'", hs.MaHS);
            exc.Excute(sqlStr);
        }

        public void Sua(HocSinh hs)
        {
            string sqlStr = string.Format("UPDATE dbo.HocSinh SET Ten = N'{0}', QueQuan = N'{1}', NgayThangNamSinh = N'{2}', CMND = N'{3}', Diem = {4} WHERE MaHS = N'{5}' AND Email = N'{6}' AND SoDT = N'{7}'", hs.Ten, hs.QueQuan, hs.NgaySinh, hs.CMND1, hs.Diem, hs.MaHS, hs.Email, hs.SoDT);
            exc.Excute(sqlStr);
        }

        public DataTable TimKiemTheoDiemGioi(HocSinh hs)
        {
            string sqlStr = string.Format("SELECT * FROM HocSinh Where Diem >=8 ");
            return exc.TimKiem(sqlStr);
        }

        public DataTable TimKiemTheoDiemKha(HocSinh hs)
        {
            string sqlStr = string.Format("SELECT * FROM HocSinh Where Diem >=5 AND Diem < 8 ");
            return exc.TimKiem(sqlStr);
        }

        public DataTable TimKiemTheoDiemTB(HocSinh hs)
        {
            string sqlStr = string.Format("SELECT * FROM HocSinh Where Diem < 5 ");
            return exc.TimKiem(sqlStr);
        }

        public DataTable LayDanhSach()
        {
            string sqlStr = string.Format("SELECT * FROM HocSinh");
            return exc.LayDanhSach(sqlStr);
        }
    }
}
