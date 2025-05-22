using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuanLyCuaHangTienLoi
{
    internal class PTTTDAO
    {
        DBConnection db = new DBConnection(Program.nv);
        public DataTable LayDanhSach()
        {
            string sql = "Select * from PhuongThucThanhToan";
            return db.LayDanhSach(sql);
        }
    }
}
