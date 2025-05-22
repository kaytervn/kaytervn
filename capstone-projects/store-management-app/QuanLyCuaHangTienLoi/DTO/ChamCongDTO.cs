using System;
using System.Collections.Generic;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuanLyCuaHangTienLoi
{
    public partial class ChamCong
    {
        public ChamCong(int maPC, TimeSpan? gioBD, TimeSpan? gioKT, double? luong)
        {
            MaPC = maPC;
            GioBD = gioBD;
            GioKT = gioKT;
            Luong = luong;
        }

        public ChamCong(DataRow row)
        {
            MaPC = (int)row["MaPC"];
            GioBD = (TimeSpan)row["GioBD"];
            GioKT = (TimeSpan)row["GioKT"];
            Luong = (double)row["Luong"];
        }
    }
}
