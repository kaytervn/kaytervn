using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.SqlClient;
using System.Data;

namespace BTTuan1
{
    internal class HocSinhDAO
    {
        DBConnection dbConn = new DBConnection();

        public DataTable LayDanhSachSinhVien()
        {
            string sqlStr = string.Format("SELECT *FROM HocSinh");
            return dbConn.LayDanhSach(sqlStr);
        }

        public void Them(HocSinh hs)
        {
            string sqlStr = string.Format("INSERT INTO Hocsinh(Ten , Diachi, CMND) VALUES ('{0}', '{1}', '{2}')", hs.Name, hs.Diachi, hs.Cmnd);
            dbConn.ThucThi(sqlStr);
        }

        public void Sua(HocSinh hs)
        {
            string sqlStr = string.Format("delete from HocSinh where Ten = '{0}'", hs.Name);
            dbConn.ThucThi(sqlStr);
        }

        public void Xoa(HocSinh hs)
        {
            string sqlStr = string.Format("update HocSinh set Diachi = '{0}' where Ten = '{1}'", hs.Diachi, hs.Name);
            dbConn.ThucThi(sqlStr);
        }
    }
}
