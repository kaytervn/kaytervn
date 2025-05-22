using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuanLyCuaHangTienLoi
{
    internal class CaDAO
    {
        DBConnection exec = new DBConnection(Program.nv);

        public DataTable LayDanhSach()
        {
            return exec.LayDanhSach("Select * from Ca");
        }

        public Ca LayThongTinCaBangMaCa(string macv)
        {
            string query = string.Format($"SELECT * FROM dbo.Ca WHERE MaCa = N'{macv}'");
            DataTable result = exec.LayDanhSach(query);

            foreach (DataRow dr in result.Rows)
            {
                return new Ca(dr);
            }
            return null;
        }
    }
}
