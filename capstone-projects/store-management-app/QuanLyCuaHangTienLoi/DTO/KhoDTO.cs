using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuanLyCuaHangTienLoi
{
    public partial class Kho
    {
        public Kho(int maSP, DateTime nSX, DateTime hSD, DateTime ngayNhapKho, bool loaiKho, int sLTonKho)
        {
            MaSP = maSP;
            NSX = nSX;
            HSD = hSD;
            NgayNhapKho = ngayNhapKho;
            LoaiKho = loaiKho;
            SLTonKho = sLTonKho;
        }

        public Kho(int maSP, DateTime nSX, DateTime hSD)
        {
            MaSP = maSP;
            NSX = nSX;
            HSD = hSD;
        }
        public Kho() { }
    }
}
