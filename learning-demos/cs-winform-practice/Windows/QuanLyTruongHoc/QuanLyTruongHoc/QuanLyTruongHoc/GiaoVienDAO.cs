using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuanLyTruongHoc
{
    internal class GiaoVienDAO
    {
        DBConnection exc = new DBConnection();

        public void Them(GiaoVien GV)
        {
            string sqlStr = string.Format("INSERT INTO dbo.GiaoVien (MaGV, Ten, QueQuan, NgayThangNamSinh, CMND, Email, SoDT) VALUES(N'{0}', N'{1}', N'{2}', N'{3}', N'{4}', N'{5}', N'{6}')", GV.MaGV, GV.Ten, GV.QueQuan, GV.NgaySinh, GV.CMND1, GV.Email, GV.SoDT);
            exc.Excute(sqlStr);
        }

        public void Xoa(GiaoVien GV)
        {
            string sqlStr = string.Format("DELETE FROM GiaoVien WHERE MaGV = '{0}'", GV.MaGV);
            exc.Excute(sqlStr);
        }

        public void Sua(GiaoVien GV)
        {
            string sqlStr = string.Format("UPDATE dbo.GiaoVien SET Ten = N'{0}', QueQuan = N'{1}', NgayThangNamSinh = N'{2}', CMND = N'{3}' WHERE MaGV = N'{4}' AND Email = N'{5}' AND SoDT = N'{6}'", GV.Ten, GV.QueQuan, GV.NgaySinh, GV.CMND1, GV.MaGV, GV.Email, GV.SoDT);
            exc.Excute(sqlStr);
        }

        public DataTable LayDanhSach()
        {
            string sqlStr = string.Format("SELECT * FROM GiaoVien");
            return exc.LayDanhSach(sqlStr);
        }
    }
}
