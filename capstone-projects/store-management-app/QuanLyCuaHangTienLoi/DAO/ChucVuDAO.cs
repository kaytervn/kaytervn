using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Net.Mime.MediaTypeNames;

namespace QuanLyCuaHangTienLoi
{
    internal class ChucVuDAO
    {
        DBConnection exec = new DBConnection(Program.nv);

        public DataTable LayDanhSach()
        {
            return exec.LayDanhSach("Select * from ChucVu");
        }

        public ChucVu LayThongTinChucVuBangMaCV(int macv)
        {
            string query = string.Format($"SELECT * FROM dbo.ChucVu WHERE MaCV = {macv}");
            DataTable result = exec.LayDanhSach(query);

            foreach (DataRow dr in result.Rows)
            {
                return new ChucVu(dr);
            }
            return null;
        }
    }
}
