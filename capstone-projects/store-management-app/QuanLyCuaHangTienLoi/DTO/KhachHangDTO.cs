using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuanLyCuaHangTienLoi
{
    public partial class KhachHang
    {
        public KhachHang(string sdt, string tenKH, double diemTichLuy)
        {
            Sdt = sdt;
            TenKH = tenKH;
            DiemTichLuy = diemTichLuy;
        }
        public KhachHang(string sdt)
        {
            Sdt = sdt;
        }
    }
}
