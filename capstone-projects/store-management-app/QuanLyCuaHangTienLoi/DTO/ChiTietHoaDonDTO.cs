using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuanLyCuaHangTienLoi
{
    public partial class ChiTietHoaDon
    {
        public ChiTietHoaDon() { }
        public ChiTietHoaDon(int maHD, int maSP, DateTime nSX, DateTime hSD, int soLuong)
        {
            MaHD = maHD;
            MaSP = maSP;
            NSX = nSX;
            HSD = hSD;
            SoLuong = soLuong;
        }
    }
}
