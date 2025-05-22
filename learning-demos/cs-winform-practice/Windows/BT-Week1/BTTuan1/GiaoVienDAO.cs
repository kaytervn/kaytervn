using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.SqlClient;
using System.Data;

namespace BTTuan1
{
    internal class GiaoVienDAO
    {
        DBConnection dbConn = new DBConnection();

        public DataTable LayDanhSachGiaoVien()
        {
            string sqlStr = string.Format("SELECT *FROM GiaoVien");
            return dbConn.LayDanhSach(sqlStr);
        }

        public void Them(GiaoVien gv)
        {
            string sqlStr = string.Format("INSERT INTO GiaoVien(Ten , Diachi, CMND) VALUES ('{0}', '{1}', '{2}')", gv.Name, gv.Diachi, gv.Cmnd);
            dbConn.ThucThi(sqlStr);
        }

        public void Sua(GiaoVien gv)
        {
            string sqlStr = string.Format("delete from GiaoVien where Ten = '{0}'", gv.Name);
            dbConn.ThucThi(sqlStr);
        }

        public void Xoa(GiaoVien gv)
        {
            string sqlStr = string.Format("update GiaoVien set Diachi = '{0}' where Ten = '{1}'", gv.Diachi, gv.Name);
            dbConn.ThucThi(sqlStr);
        }
    }
}
