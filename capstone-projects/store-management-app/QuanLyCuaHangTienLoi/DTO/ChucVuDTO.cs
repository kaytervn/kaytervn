using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuanLyCuaHangTienLoi
{
    public partial class ChucVu
    {
        public ChucVu(DataRow row)
        {
            MaCV = (int)row["MaCV"];
            TenCV = (string)row["TenCV"];
            LuongTheoGio = (double)row["LuongTheoGio"];
        }
    }
}
