using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuanLyCuaHangTienLoi
{
    public partial class NgayLe
    {
        public NgayLe(int maNL, DateTime ngay, string suKien)
        {
            MaNL = maNL;
            Ngay = ngay;
            SuKien = suKien;
        }
    }
}
