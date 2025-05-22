using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuanLyCuaHangTienLoi
{
    public partial class CuaHang
    {
        public CuaHang(int maSP, DateTime nSX, DateTime hSD, DateTime ngayXuatKho, int soLuong)
        {
            MaSP = maSP;
            NSX = nSX;
            HSD = hSD;
            NgayXuatKho = ngayXuatKho;
            SoLuong = soLuong;
        }
    }
}
